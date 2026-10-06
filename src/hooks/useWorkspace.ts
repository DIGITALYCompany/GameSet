import { createContext, useContext } from 'react';
import type { GameSetup, WorkspaceData } from '@/lib/workspace';
import type { GameId } from '@/types';

export type SyncStatus = 'local' | 'loading' | 'syncing' | 'synced' | 'error';
export interface WorkspaceContextValue {
  data: WorkspaceData;
  status: SyncStatus;
  storageError: boolean;
  saveSetup: (setup: GameSetup) => void;
  deleteSetup: (gameId: GameId) => void;
  toggleFavorite: (toolId: string) => void;
  sync: () => Promise<void>;
  importGuest: () => void;
  hasGuestData: boolean;
}
export const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
}
