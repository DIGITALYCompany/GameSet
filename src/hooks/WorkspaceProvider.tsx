import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { WorkspaceContext, type SyncStatus } from '@/hooks/useWorkspace';
import { EMPTY_WORKSPACE, readWorkspace, sanitizeWorkspace, writeWorkspace, type GameSetup, type WorkspaceData } from '@/lib/workspace';
import { supabase } from '@/lib/supabase';
import type { GameId } from '@/types';

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const owner = user?.id || 'guest';
  const [data, setData] = useState<WorkspaceData>(EMPTY_WORKSPACE);
  const [status, setStatus] = useState<SyncStatus>('loading');
  const [storageError, setStorageError] = useState(false);
  const [readyOwner, setReadyOwner] = useState<string | null>(null);
  const stateRef = useRef(data);
  const generation = useRef(0);
  const readyRef = useRef<string | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    if (loading) return;
    const run = ++generation.current;
    readyRef.current = null;
    setReadyOwner(null);
    const cached = readWorkspace(owner);
    stateRef.current = cached.data;
    setData(cached.data);
    setStorageError(false);
    setStatus(user ? 'loading' : 'local');
    if (!user) {
      readyRef.current = owner;
      setReadyOwner(owner);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data: row, error } = await supabase.from('player_workspaces').select('setups, favorites').eq('user_id', owner).maybeSingle();
        if (cancelled || generation.current !== run) return;
        if (error) { setStatus('error'); return; }
        if (cached.dirty) { setStatus('error'); return; }
        const remote = row ? sanitizeWorkspace(row) : cached.data;
        stateRef.current = remote;
        setData(remote);
        writeWorkspace(owner, { data: remote, dirty: false });
        setStatus('synced');
      } catch { if (!cancelled && generation.current === run) setStatus('error'); }
      finally { if (!cancelled && generation.current === run) { readyRef.current = owner; setReadyOwner(owner); } }
    })();
    return () => { cancelled = true; generation.current++; };
  }, [owner, user, loading]);

  const upload = useCallback((snapshot: WorkspaceData) => {
    const run = generation.current;
    if (!user) return Promise.resolve();
    setStatus('syncing');
    const job = queue.current.then(async () => {
      if (generation.current !== run) return;
      try {
        const { error } = await supabase.from('player_workspaces').upsert({ user_id: owner, setups: snapshot.setups, favorites: snapshot.favorites, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
        if (generation.current !== run) return;
        if (error) { setStatus('error'); return; }
        if (stateRef.current === snapshot) {
          setStorageError(!writeWorkspace(owner, { data: snapshot, dirty: false }));
          setStatus('synced');
        }
      } catch { if (generation.current === run) setStatus('error'); }
    });
    queue.current = job;
    return job;
  }, [owner, user]);

  const update = useCallback((transform: (previous: WorkspaceData) => WorkspaceData) => {
    if (loading || readyRef.current !== owner) return;
    const updated = sanitizeWorkspace(transform(stateRef.current));
    stateRef.current = updated;
    setData(updated);
    setStorageError(!writeWorkspace(owner, { data: updated, dirty: Boolean(user) }));
    if (user) void upload(updated);
    else setStatus('local');
  }, [loading, owner, user, upload]);

  const saveSetup = useCallback((setup: GameSetup) => update(previous => ({ ...previous, setups: [setup, ...previous.setups.filter(item => item.gameId !== setup.gameId)] })), [update]);
  const deleteSetup = useCallback((gameId: GameId) => update(previous => ({ ...previous, setups: previous.setups.filter(item => item.gameId !== gameId) })), [update]);
  const toggleFavorite = useCallback((toolId: string) => update(previous => ({ ...previous, favorites: previous.favorites.includes(toolId) ? previous.favorites.filter(id => id !== toolId) : [...previous.favorites, toolId] })), [update]);
  const importGuest = useCallback(() => {
    if (!user) return;
    const guest = readWorkspace('guest').data;
    update(previous => ({ setups: [...previous.setups, ...guest.setups.filter(item => !previous.setups.some(existing => existing.gameId === item.gameId))], favorites: [...new Set([...previous.favorites, ...guest.favorites])] }));
  }, [user, update]);
  const sync = useCallback(async () => { if (readyRef.current === owner && user) await upload(stateRef.current); }, [owner, user, upload]);
  const visibleData = readyOwner === owner ? data : EMPTY_WORKSPACE;
  const guest = readWorkspace('guest').data;
  return <WorkspaceContext.Provider value={{ data: visibleData, status: loading || readyOwner !== owner ? 'loading' : status, storageError, saveSetup, deleteSetup, toggleFavorite, sync, importGuest, hasGuestData: Boolean(user && (guest.setups.length || guest.favorites.length)) }}>{children}</WorkspaceContext.Provider>;
}
