<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out bg-base-200 shadow-[0_-4px_12px_-1px_rgba(0,0,0,0.1)]"
    :class="isOpen ? 'h-80 md:h-96' : 'h-14 cursor-pointer'"
    @click.self="!isOpen ? toggleChat() : null"
  >
    <div class="container mx-auto h-full flex flex-col">
      <!-- Header -->
      <div
        class="flex items-center justify-between p-3 border-b border-base-300"
        :class="{ 'cursor-pointer': !isOpen }"
        @click="toggleChat"
      >
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 class="font-semibold text-base-content">AI Bio-Assistant</h3>
        </div>
        <button class="btn btn-ghost btn-sm btn-circle">
          <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Chat Area -->
      <div v-if="isOpen" class="flex-grow p-4 overflow-y-auto flex flex-col space-y-3">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="chat"
          :class="message.isUser ? 'chat-end' : 'chat-start'"
        >
          <div class="chat-bubble" :class="message.isUser ? 'chat-bubble-primary' : 'chat-bubble-secondary'">
            {{ message.text }}
          </div>
          <div class="chat-footer opacity-50 text-xs">
            {{ message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </div>
        </div>
        <div v-if="isTyping" class="chat chat-start">
          <div class="chat-bubble chat-bubble-secondary">
            <span class="loading loading-dots loading-md"></span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div v-if="isOpen" class="p-3 border-t border-base-300">
        <form @submit.prevent="sendMessage" class="flex items-center gap-2">
          <input
            type="text"
            v-model="newMessage"
            placeholder="Ask about your bio-data..."
            class="input input-bordered input-sm flex-grow"
            :disabled="isTyping"
          />
          <button type="submit" class="btn btn-primary btn-sm" :disabled="!newMessage.trim() || isTyping">
            Send
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const isOpen = ref(false);
const messages = ref<ChatMessage[]>([
  {
    text: "Hello! How can I help you analyze your bio-data today?",
    isUser: false,
    timestamp: new Date(Date.now() - 60000),
  },
]);
const newMessage = ref('');
const isTyping = ref(false);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const scrollToBottom = () => {
  nextTick(() => {
    const chatContentArea = document.querySelector('.overflow-y-auto');
    if (chatContentArea) {
      chatContentArea.scrollTop = chatContentArea.scrollHeight;
    }
  });
};

watch(messages, scrollToBottom, { deep: true });
watch(isTyping, scrollToBottom);

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  messages.value.push({ text: newMessage.value, isUser: true, timestamp: new Date() });
  const userMessage = newMessage.value;
  newMessage.value = '';
  isTyping.value = true;

  const maxRetries = 2;
  let attempts = 0;
  let success = false;
  let errorMessage = '';

  while (attempts <= maxRetries && !success) {
    try {
      const response = await fetch('https://krave-6r7n.vercel.app/api/krave-gemini-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || "Sorry, I didn't understand that.";
      messages.value.push({ text: aiResponse, isUser: false, timestamp: new Date() });
      success = true;
    } catch (error: any) {
      attempts++;
      errorMessage = error.message || 'Unknown error';
      if (attempts > maxRetries) {
        messages.value.push({
          text: `Error: ${errorMessage} (after ${attempts} attempts)`,
          isUser: false,
          timestamp: new Date(),
        });
      }
    }
  }

  isTyping.value = false;
};
</script>

<style scoped>
.overflow-y-auto {
  /* Custom scroll behavior if needed */
}
</style>
