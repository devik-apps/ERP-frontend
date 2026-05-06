export type ApiState = 'loading' | 'error' | 'empty' | 'data'

export function resolveApiState(
  isPending: boolean,
  isError: boolean,
  isEmpty: boolean,
): ApiState {
  if (isPending) return 'loading'
  if (isError) return 'error'
  if (isEmpty) return 'empty'
  return 'data'
}
