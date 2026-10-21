<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import RichText from '../common/RichText.vue'
import { useI18n } from '../../i18n'
import { useTutorChat } from '../../composables/useTutorChat.js'
import { TUTOR_MAX_CHARS } from '../../config/api.js'

const { t } = useI18n()
const c = computed(() => t.value.tutor.chat)
const { messages, sending, errorKey, remaining, send, reset } = useTutorChat()

const draft = ref('')
const input = ref(null)
const log = ref(null)

const canSend = computed(() => draft.value.trim().length > 0 && !sending.value)
const nearLimit = computed(() => draft.value.length > TUTOR_MAX_CHARS * 0.75)

function autosize() {
  const el = input.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 140)}px`
}

async function scrollDown() {
  await nextTick()
  if (log.value) log.value.scrollTop = log.value.scrollHeight
}

async function submit(text = draft.value) {
  if (!text.trim() || sending.value) return
  draft.value = ''
  autosize()
  const ok = await send(text)
  if (!ok) draft.value = text // la pregunta no se pierde si falló: el estudiante puede reenviarla
  await nextTick()
  autosize()
  input.value?.focus()
}

function onKeydown(e) {
  // Enter envía; Shift+Enter hace salto de línea. No enviar mientras se compone con teclado IME.
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    submit()
  }
}

function newConversation() {
  reset()
  draft.value = ''
  autosize()
  input.value?.focus()
}

watch(() => [messages.value.length, sending.value, errorKey.value], scrollDown)
onMounted(scrollDown)
</script>

<template>
  <section class="card chat" aria-labelledby="tu-chat-title">
    <header class="top">
      <h2 id="tu-chat-title"><AppIcon name="robot" :size="20" /> {{ c.title }}</h2>
      <button v-if="messages.length" type="button" class="clear" @click="newConversation">
        <AppIcon name="refresh" :size="15" /> {{ c.clear }}
      </button>
    </header>

    <div ref="log" class="log" role="log" aria-live="polite" :aria-label="c.logLabel" tabindex="0">
      <!-- Saludo local: no se envía al modelo -->
      <div class="row bot">
        <span class="avatar" aria-hidden="true"><AppIcon name="robot" :size="18" /></span>
        <div class="bubble"><span class="who">{{ c.tutor }}</span><p>{{ c.welcome }}</p></div>
      </div>

      <div v-if="!messages.length" class="suggest">
        <p>{{ c.suggestionsTitle }}</p>
        <div class="chips">
          <button v-for="q in c.suggestions" :key="q" type="button" :disabled="sending" @click="submit(q)">{{ q }}</button>
        </div>
      </div>

      <div v-for="m in messages" :key="m.id" class="row" :class="m.role === 'user' ? 'me' : 'bot'">
        <span v-if="m.role !== 'user'" class="avatar" aria-hidden="true"><AppIcon name="robot" :size="18" /></span>
        <div class="bubble">
          <span class="who">{{ m.role === 'user' ? c.you : c.tutor }}</span>
          <p><RichText :text="m.content" /></p>
        </div>
      </div>

      <div v-if="sending" class="row bot" role="status">
        <span class="avatar" aria-hidden="true"><AppIcon name="robot" :size="18" /></span>
        <div class="bubble typing"><span class="sr">{{ c.thinking }}</span><i></i><i></i><i></i></div>
      </div>
    </div>

    <p v-if="errorKey" class="error" role="alert">
      <AppIcon name="alert" :size="16" /> {{ t.tutor.errors[errorKey] }}
    </p>

    <form class="composer" @submit.prevent="submit()">
      <label class="sr" for="tutor-input">{{ c.inputLabel }}</label>
      <div class="field">
        <textarea
          id="tutor-input"
          ref="input"
          v-model="draft"
          rows="1"
          :maxlength="TUTOR_MAX_CHARS"
          :placeholder="c.placeholder"
          @input="autosize"
          @keydown="onKeydown"
        ></textarea>
        <button type="submit" class="send" :disabled="!canSend" :aria-label="c.send" :title="c.send">
          <AppIcon name="play" :size="18" />
        </button>
      </div>
      <div class="meta">
        <span v-if="remaining !== null" class="left">{{ c.remaining(remaining) }}</span>
        <span v-if="nearLimit" class="count">{{ c.counter(draft.length, TUTOR_MAX_CHARS) }}</span>
      </div>
    </form>

    <p class="ai">{{ c.aiNotice }}</p>
  </section>
</template>

<style scoped>
.chat { display: flex; flex-direction: column; min-height: 520px; padding: 0; overflow: hidden; }
.top { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--line); }
.top h2 { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; color: var(--blue-900); }
.clear {
  display: inline-flex; align-items: center; gap: 6px; background: none; color: var(--ink-2);
  border: 1px solid var(--line); border-radius: 999px; padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer;
}
.clear:hover { background: var(--hover); color: var(--ink); }

.log { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 14px; max-height: 560px; min-height: 320px; }

.row { display: flex; gap: 10px; align-items: flex-end; max-width: 100%; }
.row.me { justify-content: flex-end; }
.avatar {
  flex: none; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center;
  background: var(--tint-green); color: var(--teal-600);
}
.bubble { max-width: min(78%, 620px); padding: 10px 14px; border-radius: 16px; font-size: 15px; line-height: 1.5; }
.bot .bubble { background: var(--tint-blue); color: var(--ink); border-bottom-left-radius: 4px; }
.me .bubble { background: var(--blue-900); color: var(--on-accent); border-bottom-right-radius: 4px; }
.who { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; opacity: 0.8; margin-bottom: 2px; }
.bubble p { white-space: pre-wrap; overflow-wrap: anywhere; }

.typing { display: flex; align-items: center; gap: 5px; padding: 14px 16px; }
.typing i { width: 7px; height: 7px; border-radius: 50%; background: var(--ink-2); animation: bounce 1.2s ease-in-out infinite; }
.typing i:nth-of-type(2) { animation-delay: 0.15s; }
.typing i:nth-of-type(3) { animation-delay: 0.3s; }
@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.45; } 40% { transform: translateY(-4px); opacity: 1; } }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.suggest { padding-left: 42px; }
.suggest p { font-size: 13px; font-weight: 600; color: var(--ink-2); margin-bottom: 8px; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chips button {
  background: var(--surface); color: var(--blue-900); border: 1.5px solid var(--line); border-radius: 999px;
  padding: 8px 14px; font-size: 14px; font-weight: 600; cursor: pointer; text-align: left;
  transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}
.chips button:hover:not(:disabled) { background: var(--tint-blue); border-color: var(--blue-900); transform: translateY(-1px); }
.chips button:disabled { cursor: not-allowed; opacity: 0.6; }

.error {
  display: flex; align-items: center; gap: 8px; margin: 0 20px 12px; padding: 10px 14px; border-radius: 12px;
  background: var(--danger-tint); color: var(--danger); font-size: 14px; font-weight: 600;
}

.composer { padding: 0 20px; border-top: 1px solid var(--line); padding-top: 14px; }
.field { display: flex; align-items: flex-end; gap: 10px; }
textarea {
  flex: 1; resize: none; font: inherit; font-size: 15px; line-height: 1.4; color: var(--ink);
  background: var(--surface); border: 1.5px solid var(--line); border-radius: 14px; padding: 11px 14px; max-height: 140px;
}
textarea::placeholder { color: var(--ink-2); }
textarea:focus { outline: none; border-color: var(--blue-900); box-shadow: 0 0 0 3px var(--tint-blue); }
.send {
  flex: none; width: 46px; height: 46px; border-radius: 14px; border: 0; cursor: pointer;
  background: var(--green-cta); color: var(--on-cta); display: grid; place-items: center;
  transition: background-color 0.15s ease, transform 0.15s ease;
}
.send:hover:not(:disabled) { background: var(--green-cta-hover); transform: translateY(-1px); }
.send:disabled { background: var(--tint-muted); color: var(--ink-2); cursor: not-allowed; }
.meta { display: flex; justify-content: space-between; gap: 12px; min-height: 22px; padding: 6px 2px 0; font-size: 12.5px; color: var(--ink-2); }
.count { margin-left: auto; font-variant-numeric: tabular-nums; }
.ai { padding: 0 20px 16px; font-size: 12.5px; color: var(--ink-2); }

@media (max-width: 720px) {
  .bubble { max-width: 88%; }
  .suggest { padding-left: 0; }
  .log { padding: 14px; }
  .composer { padding-inline: 14px; }
}
</style>
