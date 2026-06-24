---
name: advanced-concurrency
description: Write Python concurrent code without relying on accidental atomicity; communicate with queues and synchronize shared state explicitly.
---

# Concurrency

Concurrent Python code must not rely on implementation details such as apparent atomicity of built-in operations. Make ownership, communication, and shutdown explicit.

## Usage

Prefer passing data between threads with `queue.Queue` rather than sharing mutable containers.

```python
def worker(tasks: queue.Queue[Task], results: queue.Queue[Result]) -> None:
    while True:
        task = tasks.get()
        try:
            if task is _STOP:
                return
            results.put(process(task))
        finally:
            tasks.task_done()
```

When shared state is necessary, guard it with `threading` primitives and document the ownership rule.

```python
class Counter:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._value = 0

    def increment(self) -> None:
        with self._lock:
            self._value += 1

    def value(self) -> int:
        with self._lock:
            return self._value
```

Prefer `threading.Condition` for wait/notify coordination over manually spinning or using low-level locks alone.

```python
with condition:
    condition.wait_for(lambda: state.ready)
    consume(state.value)
```

## Key Points

- Do not rely on dict/list operations or variable assignment being atomic; user-defined `__hash__`/`__eq__` and interpreter details can break assumptions.
- Keep mutable module/class state out of concurrent paths unless it is synchronized.
- Catch broad exceptions only at thread/process isolation boundaries, and log context before suppressing.
- Prefer simpler synchronous code unless concurrency is needed for throughput, latency, or integration constraints.

<!--
Source references:
- https://google.github.io/styleguide/pyguide.html#s2.18-threading
- https://google.github.io/styleguide/pyguide.html#s2.5-global-variables
- https://google.github.io/styleguide/pyguide.html#s2.4-exceptions
-->
