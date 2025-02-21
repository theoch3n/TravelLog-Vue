// 引入 createVuetify 函式與 Vuetify 的 CSS 樣式
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

// 建立一個 Vuetify 實例，並設定主題
const vuetify = createVuetify({
  theme: {
    // 預設主題設定：light 或 dark
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false, // light 主題為非深色模式
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#1976D2',
          // 你可以在這裡定義其他顏色
        },
      },
      dark: {
        dark: true, // dark 主題為深色模式
        colors: {
          background: '#121212',
          surface: '#121212',
          primary: '#BB86FC',
          // 你可以在這裡定義其他顏色
        },
      },
    },
  },
})

// 將 vuetify 實例輸出供其他地方引用
export default vuetify
