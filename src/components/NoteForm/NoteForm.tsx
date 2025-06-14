
import { useId } from 'react'
import css from './NoteForm.module.css'
import { Formik, Form, Field, ErrorMessage,  type FormikHelpers } from 'formik'
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import type { NewNoteData, NoteTag } from '../../types/note';

const OrderSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Title is too short!')
        .max(50, 'Title is too long!')
        .required('This field is required!'),
    content: Yup.string()
        .max(500, 'Content is too long'),
    tag: Yup.string()
        .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Incorrect tag')
        .required('Tag field is required!')
})

interface NoteFormProps {
    onClose: () => void;
}

interface FormikProps {
    title: string;
    content: string;
    tag: NoteTag;
}

const initialValues: FormikProps = {
    title: '',
    content: '',
    tag: 'Todo',
}

export default function NoteForm({ onClose }: NoteFormProps) {
    const queryClient = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationFn: (noteData: NewNoteData) => createNote(noteData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            onClose();
        }
    })

    const fieldId = useId();

    const handleSubmit = (values: FormikProps, actions: FormikHelpers<FormikProps>) => {
        mutate({
            title: values.title,
            content: values.content,
            tag: values.tag,
        })
        actions.resetForm();
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={OrderSchema}
            onSubmit={handleSubmit}>
            <Form>
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-title`} className={css.label}>Title</label>
                    <Field
                        type='text'
                        name='title'
                        id={`${fieldId}-title`}
                        className={css.input}
                    />
                    <ErrorMessage
                        name='title'
                        component='span'
                        className={css.error}
                    />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-content`} className={css.label}>Content</label>
                    <Field
                        as='textarea'
                        name='content'
                        rows={8}
                        id={`${fieldId}-content`}
                        className={css.textarea}
                    />
                    <ErrorMessage
                        name='content'
                        component='span'
                        className={css.error}
                    />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-tag`} className={css.label}>Tag</label>
                    <Field
                        as='select'
                        name='tag'
                        id={`${fieldId}-tag`}
                        className={css.select}
                    >
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage
                        name='tag'
                        component='span'
                        className={css.error}
                    />
                </div>

                <div className={css.actions}>
                    <button type='button' className={css.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button type='submit' className={css.submitButton}>
                        {isPending ? 'Creating new note...' : 'Create note'}
                    </button>
                </div>
            </Form>
        </Formik>
    )
}
