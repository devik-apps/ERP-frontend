<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: false, auth: false })

const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const pending = ref(false)

async function onSubmit() {
  error.value = null
  pending.value = true
  const { error: err } = await signIn(email.value, password.value)
  pending.value = false
  if (err) {
    error.value = 'Identifiants invalides'
    return
  }
  await navigateTo('/dashboard')
}
</script>

<template>
  <div class="login-shell">
    <div class="login-card">
      <div class="login-brand">
        <span class="login-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M3 12c3-5 8-6 12-6 3 0 6 2 6 6s-3 6-6 6c-4 0-9-1-12-6Z" />
            <circle cx="16" cy="11" r="0.6" fill="currentColor" stroke="none" />
            <path d="M3 12c1.5-1 3-1 4 0M3 12c1.5 1 3 1 4 0" />
          </svg>
        </span>
        <div>
          <div class="login-title">Poissonnerie du Vieux Port</div>
          <div class="login-subtitle">Connexion à l'ERP</div>
        </div>
      </div>

      <form class="login-form" @submit.prevent="onSubmit">
        <label class="login-field">
          <span>Email</span>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            required
            placeholder="vous@poissonnerie.fr"
          />
        </label>

        <label class="login-field">
          <span>Mot de passe</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            placeholder="••••••••"
          />
        </label>

        <p v-if="error" class="login-error" role="alert">{{ error }}</p>

        <button type="submit" class="btn btn-primary login-submit" :disabled="pending">
          {{ pending ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-shell {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--color-scale-50, #f5f6f7);
}
.login-card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  border: 0.5px solid var(--color-scale-200, #e2e5e8);
  border-radius: 14px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  box-shadow: 0 8px 24px rgba(74, 98, 116, 0.05);
}
.login-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.login-mark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--color-slate, #4A6274);
  color: #fff;
  display: grid;
  place-items: center;
}
.login-title {
  font-weight: 500;
  color: var(--color-slate, #4A6274);
}
.login-subtitle {
  font-size: 12px;
  color: var(--color-scale-500, #7a8896);
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.login-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--color-slate, #4A6274);
}
.login-field input {
  height: 38px;
  padding: 0 12px;
  border: 0.5px solid var(--color-scale-200, #e2e5e8);
  border-radius: 8px;
  font: inherit;
  color: var(--color-slate, #4A6274);
  background: #fff;
  transition: border-color 0.15s ease;
}
.login-field input:focus {
  outline: none;
  border-color: var(--color-coral, #D4856A);
}
.login-error {
  background: rgba(212, 133, 106, 0.08);
  color: var(--color-coral, #D4856A);
  border: 0.5px solid rgba(212, 133, 106, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  margin: 0;
}
.login-submit {
  margin-top: 4px;
}
</style>
