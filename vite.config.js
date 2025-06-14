import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import cssnano from 'cssnano'

export default defineConfig({
    define: {
        global: 'window',
    },
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    css: {
        postcss: {
            plugins: [
                cssnano({
                    preset: ['default', {
                        discardComments: {
                            removeAll: true,  // Xóa tất cả comment CSS
                        },
                    }]
                })
            ]
        }
    }
})
