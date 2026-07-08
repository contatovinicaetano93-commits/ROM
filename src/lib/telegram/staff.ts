export function getStaffChatIds(): string[] {
  // TELEGRAM_ALLOWED_CHAT_IDS = legado na Vercel (ROM Brasil); preferir STAFF
  const raw =
    process.env.TELEGRAM_STAFF_CHAT_IDS?.trim() ||
    process.env.TELEGRAM_ALLOWED_CHAT_IDS?.trim()
  if (!raw) return []
  return raw.split(/[,\s]+/).filter(Boolean)
}

/** Sem whitelist configurada, aceita qualquer chat (modo aberto). */
export function isStaffChat(chatId: number | string): boolean {
  const ids = getStaffChatIds()
  if (ids.length === 0) return true
  return ids.includes(String(chatId))
}

export function isStaffWhitelistEnabled() {
  return getStaffChatIds().length > 0
}
