<script>
    import { writable } from "svelte/store";

    // Load todos from localStorage
    const storedTodos = localStorage.getItem("todos");
    let todos = writable(storedTodos ? JSON.parse(storedTodos) : []);

    // Save todos to localStorage whenever they change
    todos.subscribe((value) => {
        localStorage.setItem("todos", JSON.stringify(value));
    });

    let newTodo = "";
    let newNumber = 1;

    function addTodo() {
        if (newTodo.trim() === "") return;
        todos.update((list) => [
            ...list,
            { id: Date.now(), text: newTodo, done: false, number: newNumber },
        ]);
        newTodo = "";
        newNumber = 1;
    }

    function toggleTodo(id) {
        todos.update((list) =>
            list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        );
    }

    function deleteTodo(id) {
        todos.update((list) => list.filter((t) => t.id !== id));
    }

    function totalNumbers() {
        let sum = 0;
        $todos.forEach((t) => (sum += t.number || 0));
        return sum;
    }

    function calcTotal($todos) {
        const totalPoints = $todos.reduce((sum, t) => sum + (t.number || 0), 0);

        // Total minutes from points
        let totalMinutes = totalPoints * 30;

        // Extra 10 min for every 4 points
        const extra = Math.floor(totalPoints / 4) * 10;
        totalMinutes += extra;

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return {
            totalPoints,
            totalTime: `${hours}:${minutes.toString().padStart(2, "0")}`,
        };
    }

    $: total = calcTotal($todos);
</script>

<!-- Total sum of all numbers -->
<div class="counter">
    <p>Total: {totalNumbers()}</p>
    <p>Total time: {total.totalTime}</p>
</div>

<div>
    <input
        type="text"
        bind:value={newTodo}
        placeholder="Add a todo"
        on:keydown={(e) => e.key === "Enter" && addTodo()}
    />
    <input
        type="number"
        bind:value={newNumber}
        min="1"
        placeholder="Number"
        on:input={(e) => (newNumber = Math.max(1, +e.target.value))}
        on:keydown={(e) => e.key === "Enter" && addTodo()}
    />
    <button on:click={addTodo}>Add</button>
</div>

<ul>
    {#each $todos as todo (todo.id)}
        <li>
            <input
                type="checkbox"
                checked={todo.done}
                on:change={() => toggleTodo(todo.id)}
            />
            <span class:done={todo.done}>{todo.text} ({todo.number})</span>
            <button on:click={() => deleteTodo(todo.id)}>Delete</button>
        </li>
    {/each}
</ul>

<style>
    .counter {
        background: maroon;
        padding: 2px 10px;
        border-radius: 10px;
        margin-top: 10px;
    }
    .done {
        text-decoration: line-through;
        color: gray;
    }
    input {
        background: transparent;
        border: 0;
        color: white;
        font-size: 12px;
        border-radius: 10px;
        margin-bottom: 5px;
        padding: 2px 8px;
        background: #aa470c;
    }

    ul {
        padding: 0;
        list-style: none;
    }

    li {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        gap: 5px;
    }

    button {
        background: #ff5400;
        border: 0px;
        font-size: 12px;
        color: white;
        padding: 0 10px;
        border-radius: 10px;
        font-family: bitbuntu;
    }

    .counter {
        margin-bottom: 10px;
        font-weight: bold;
    }
</style>
