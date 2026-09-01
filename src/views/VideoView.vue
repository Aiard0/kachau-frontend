<script setup lang="ts">
import { Video } from '@lucide/vue'

function goBack() {
  history.back()
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-gray-900 shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <button @click="goBack" class="text-2xl font-bold text-white hover:text-gray-300">
          Kachau<span class="text-blue-500">.</span>Store
        </button>
        <div class="flex items-center gap-4">
          <router-link to="/" class="text-gray-300 hover:text-white flex items-center gap-1">
            Voltar
          </router-link>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Video :size="24" class="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-yellow-800 font-medium">AVISO:</p>
            <p class="text-yellow-700 text-sm mt-1">
              O vídeo do projeto está hospedado num bucket anexado ao site, mas devido ao egresso de 10GB de rede da Vercel, talvez esse vídeo fique indisponível, então pode acessar o vídeo pelo YouTube clicando
              <a
                href="https://youtu.be/X9VB7lyC5Ls"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800 underline"
              >
                nesse link
              </a>
              .
            </p>
          </div>
        </div>

        <div class="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            src="https://it24furklgmikhpc.public.blob.vercel-storage.com/video.mp4"
            controls
            class="w-full h-full"
          >
            Seu navegador não suporta a reprodução de vídeo.
          </video>
        </div>
      </div>
    </main>
  </div>
</template>
