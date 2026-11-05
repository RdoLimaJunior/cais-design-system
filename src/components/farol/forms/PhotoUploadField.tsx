import { useRef, type ChangeEvent } from 'react'
import { IconUser } from '@tabler/icons-react'
import { Button } from '../../ui/button'
import { FormFieldLabel, FormHelperText } from './FormField'

const PHOTO_GUIDANCE =
  'Envie uma foto recente com rosto centralizado, fundo neutro e boa iluminação, sem óculos de sol ou acessórios que cubram o rosto.'

export interface PhotoUploadFieldProps {
  photoUrl: string | null
  altText: string
  onPhotoChange: (file: File) => void
  onPhotoRemove: () => void
}

export function PhotoUploadField({ photoUrl, altText, onPhotoChange, onPhotoRemove }: PhotoUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onPhotoChange(file)
    event.target.value = ''
  }

  return (
    <div>
      <FormFieldLabel htmlFor="profile-photo">Foto para comunicação interna</FormFieldLabel>
      <FormHelperText className="max-w-[340px]">{PHOTO_GUIDANCE}</FormHelperText>
      <div className="mt-2 w-full max-w-[305px] rounded border border-zinc-200 bg-white px-5 py-4">
        <div className="flex h-20 w-24 items-center justify-center overflow-hidden rounded bg-zinc-100 text-zinc-400">
          {photoUrl ? (
            <img alt={altText} className="size-full object-cover" src={photoUrl} />
          ) : (
            <IconUser className="size-8" aria-hidden="true" />
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onPhotoRemove}
            className="h-8 rounded border-red-500 bg-white px-4 text-[10px] text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Remover foto
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 rounded border-[#0089e2] bg-white px-4 text-[10px] font-medium text-[#0089e2] hover:bg-sky-50 hover:text-[#0077c5]"
          >
            Substituir foto
          </Button>
        </div>
      </div>
      <input ref={fileInputRef} id="profile-photo" type="file" accept="image/*" className="sr-only" onChange={handleFileSelected} />
    </div>
  )
}
