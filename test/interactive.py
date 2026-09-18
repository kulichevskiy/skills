"""Drive real installer terminal prompts in an isolated test home (POSIX)."""
import errno
import json
import os
import pty
import select
import signal
import sys
import time

command, steps = json.loads(sys.argv[1]), json.loads(sys.argv[2])
pid, master = pty.fork()
if pid == 0:
    os.execvpe(command[0], command, os.environ)
transcript = b''
remaining = b''
index = 0
status = None
deadline = time.monotonic() + 15
try:
    while time.monotonic() < deadline:
        if select.select([master], [], [], 0.1)[0]:
            try:
                chunk = os.read(master, 65536)
            except OSError as error:
                if error.errno != errno.EIO:
                    raise
                break
            if not chunk:
                break
            transcript += chunk
            remaining += chunk
            if index < len(steps):
                prompt, answer = steps[index]
                marker = prompt.encode()
                if marker in remaining:
                    remaining = remaining.split(marker, 1)[1]
                    os.write(master, b'\x04' if answer is None else (answer + '\n').encode())
                    index += 1
        done, result = os.waitpid(pid, os.WNOHANG)
        if done:
            status = result
            break
    else:
        raise TimeoutError('Installer did not finish')
    if status is None:
        _, status = os.waitpid(pid, 0)
    if index != len(steps):
        raise AssertionError(f'Only {index}/{len(steps)} prompts observed')
finally:
    if status is None:
        os.kill(pid, signal.SIGKILL)
        os.waitpid(pid, 0)
    os.close(master)
    sys.stdout.write(transcript.decode(errors='replace'))
sys.exit(os.waitstatus_to_exitcode(status))
