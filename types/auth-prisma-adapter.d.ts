declare module '@auth/prisma-adapter' {
  import type { PrismaClient } from '@prisma/client'
  import type { Adapter } from 'next-auth/adapters'

  export function PrismaAdapter(prisma: PrismaClient): Adapter
}
