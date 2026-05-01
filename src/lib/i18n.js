import { useLangStore } from '../store'
import { translations } from './translations'

export function useT() {
  const lang = useLangStore(s => s.lang)
  return (key) => translations[lang]?.[key] ?? translations.en[key] ?? key
}
