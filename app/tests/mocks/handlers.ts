import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('https://api.erp.local/v1/categories', () => {
    return HttpResponse.json({
      data: [
        { id: 'cat-1', label: 'Poissons frais', isActive: true },
        { id: 'cat-2', label: 'Coquillages', isActive: true },
      ],
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
    })
  }),

  http.put('https://api.erp.local/v1/categories/:id', async ({ request, params }) => {
    const body = await request.json() as { label: string; isActive: boolean }
    return HttpResponse.json(
      { id: params['id'], label: body.label, isActive: body.isActive },
      { status: 201 },
    )
  }),
]
