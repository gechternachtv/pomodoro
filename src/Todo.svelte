<script>
    import { writable } from "svelte/store";
    import {  createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    // Load todos from localStorage
    const storedTodos = localStorage.getItem("todos");
    let todos = writable(storedTodos ? JSON.parse(storedTodos) : []);

    // Save todos to localStorage whenever they change
    todos.subscribe((value) => {
        localStorage.setItem("todos", JSON.stringify(value));
    });

    let newTodo = "";
    let newNumber = 1;

   	function formatTime(number){
	const toString = number.toString()
	  if(toString.length === 1){
			return "0" + toString
			}else{
			return toString
			}
	}

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

        const incompleteTodos = $todos.filter(a => a.done === false)
        if(incompleteTodos.length === 0 && $todos.length > 0){
          console.log(" complete!");
          dispatch("finished");
        }

        const totalPoints = incompleteTodos.reduce((sum, t) => sum + (t.number || 0), 0);

        // Total minutes from points
        let totalMinutes = (totalPoints * 25)
        let extra = 0;



        for (let i = 1; i <= totalPoints; i++) {

            if(i % 4 === 0 && i != totalPoints){
              console.log("long rest!")
              extra +=15
            }else if(i != totalPoints){
              console.log("short rest!")
              extra +=5
            }

          console.log({i:i,totalpoints:totalPoints,extraminutes:extra})
        }



        totalMinutes += extra;

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return {
            totalPoints,
            totalTime: `${formatTime(hours)}h:${minutes.toString().padStart(2, "0")}m`,
        };
    }

    $: total = calcTotal($todos);
</script>

<!-- Total sum of all numbers -->
<div class="counter">
    <p>Total: {totalNumbers()}</p>
    <p>Time estimation: {total.totalTime}</p>
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
