import { zodResolver } from '@hookform/resolvers/zod'
import type { MutationOptions } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import type { CreateShortUrlInput } from '@/api/create-short-url'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { TextField } from '@/components/text-field'
import { Toast } from '@/components/toast'
import { useCreateShortUrlMutation } from '@/queries/use-create-short-url-mutation'
import { slugSchema, unshortenedUrlSchema } from '@/schemas'

const createNewUrlFormSchema = z.object({
  unshortenedUrl: unshortenedUrlSchema,
  slug: slugSchema,
})

type CreateNewUrlFormSchema = z.infer<typeof createNewUrlFormSchema>

interface CreateShortUrlFormCardProps {
  cardRoot: React.ComponentProps<'div'>
}

export function CreateShortUrlFormCard({
  cardRoot,
}: CreateShortUrlFormCardProps) {
  const { mutate: createShortUrlFn, isPending: isCreateShortUrlPending } =
    useCreateShortUrlMutation()

  const {
    formState: { errors },
    reset: resetForm,
    register,
    handleSubmit,
  } = useForm<CreateNewUrlFormSchema>({
    resolver: zodResolver(createNewUrlFormSchema),
    values: {
      unshortenedUrl: '',
      slug: '',
    },
  })

  const isSubmitDisabled = isCreateShortUrlPending

  async function handleCreateShortUrl(data: CreateNewUrlFormSchema) {
    const { unshortenedUrl, slug } = data

    const variables: CreateShortUrlInput = {
      body: {
        unshortenedUrl,
        slug,
      },
    }

    const options: MutationOptions<void, Error, CreateShortUrlInput> = {
      onSuccess() {
        resetForm()
      },
      onError(error) {
        if (!isAxiosError(error)) {
          return
        }

        const status = error.response?.status

        if (status === 409) {
          toast.custom(id => (
            <Toast
              id={id}
              title="O link encurtado já existe. Valor deve ser único."
              type="error"
            />
          ))
        }
      },
    }

    createShortUrlFn(variables, options)
  }

  return (
    <Card.Root className={cardRoot.className}>
      <Card.Content>
        <form
          className="flex flex-col gap-5 md:gap-6"
          onSubmit={handleSubmit(handleCreateShortUrl)}
        >
          <span className="text-brand-lg">Novo Link</span>
          <div className="space-y-4">
            <TextField.Root error={errors.unshortenedUrl?.message}>
              <TextField.Label text="Link original">
                <TextField.Field>
                  <TextField.Input
                    autoComplete="off"
                    placeholder="https://brev.ly"
                    {...register('unshortenedUrl')}
                  />
                </TextField.Field>
              </TextField.Label>
            </TextField.Root>
            <TextField.Root error={errors.slug?.message}>
              <TextField.Label text="Link encurtado">
                <TextField.Field>
                  <span className="font-normal text-brand-gray-400 text-brand-md">
                    {location.host}/
                  </span>
                  <TextField.Input
                    autoComplete="off"
                    placeholder="brev-ly"
                    {...register('slug')}
                  />
                </TextField.Field>
              </TextField.Label>
            </TextField.Root>
          </div>
          <Button
            disabled={isSubmitDisabled}
            loading={isCreateShortUrlPending}
            type="submit"
          >
            Salvar link
          </Button>
        </form>
      </Card.Content>
    </Card.Root>
  )
}
