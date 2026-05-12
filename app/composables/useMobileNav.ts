export function useMobileNav() {
  const open = useState<boolean>('mobile-nav-open', () => false)

  return {
    open,
    toggle: () => { open.value = !open.value },
    close: () => { open.value = false },
  }
}
