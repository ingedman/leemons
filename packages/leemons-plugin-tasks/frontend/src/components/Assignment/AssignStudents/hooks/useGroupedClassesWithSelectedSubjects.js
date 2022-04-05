import { useFormContext, useWatch } from 'react-hook-form';
import useGroupedClasses from './useGroupedClasses';

export default function useGroupedClassesWithSelectedSubjects(disableGrouping) {
  const form = useFormContext();
  if (!form) {
    throw new Error('useGroupedClassesWithSelectedSubjects needs a FormContext');
  }

  const { control } = form;
  const subjects = useWatch({ name: 'subjects', control });

  return { ...useGroupedClasses(subjects, disableGrouping), subjects };
}
