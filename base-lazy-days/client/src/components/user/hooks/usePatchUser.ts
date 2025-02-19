import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import jsonpatch from 'fast-json-patch';

import type { User } from '@shared/types';

import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useUser } from './useUser';

import { queryKeys } from '@/react-query/constants';

export const MUTATION_KEY = 'patch-user';

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData.token)
    }
  );
  return data.user;
}

export function usePatchUser() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const toast = useToast();

  const { mutate: patchUser } = useMutation({
    mutationKey: [MUTATION_KEY],
    mutationFn: (newData: User) => patchUserOnServer(newData, user),
    onSuccess: () => {
      toast({ title: 'User updated!', status: 'success' });
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: [queryKeys.user] });
    }
  });

  return patchUser;
}
