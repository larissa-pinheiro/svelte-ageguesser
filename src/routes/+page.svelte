<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import './+page.css';
  
  let name = '';
  let result = null;
  let status = 'idle';
  let error = '';
  let debounce;

  $: {
    if ($page.url.searchParams.has('name')) {
      name = $page.url.searchParams.get('name') || '';
    }
  }

  $: {
    const data = $page.data?.data;
    if (data?.age) {
      result = data;
      error = '';
      status = 'done';
    } else if (data?.error) {
      error = data.error;
      result = null;
      status = 'error';
    } else {
      result = null;
      error = '';
      status = 'idle';
    }
  }

  function handleInput(e) {
    const value = e.target.value.trim();
    const isValidName = /^[a-zA-ZÀ-ÿ\s]+$/.test(value);

    clearTimeout(debounce);
    name = value;

    if (!value) {
      goto('/');
      return;
    }

      if (!isValidName) {
    error = "Por favor, digite um nome válido (apenas letras).";
    status = 'error';
    result = null;
    return;
    }

    error = '';
    status = 'idle';

    debounce = setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('name', value);
      goto(`${url.pathname}?${url.searchParams.toString()}`, { replaceState: true });
    }, 700);
  }
</script>

<svelte:head>
  <title>Age Guesser | Estimativa de Idade</title>
</svelte:head>

<div class="container">
  <h1>Age Guesser</h1>
  <p class="subtitle">Digite um nome e veja a idade estimada com base em dados</p>

  <input
    type="text"
    class="input"
    placeholder="Digite um nome..."
    bind:value={name}
    on:input={handleInput}
    aria-label="Campo para nome"
    autocomplete="off"
  />

  {#if status === 'done'}
    <div class="result">
      <div class="name">{name}</div>
      <div class="age">{result.age} <span>anos</span></div>
      <div class="meta">Baseado em {result.count} registros</div>
    </div>
  {:else if status === 'error'}
    <div class="error">{error}</div>
  {:else if status === 'idle' && name}
    <div class="loading">Carregando...</div>
  {/if}
</div>
