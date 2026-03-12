import { supabase } from './supabase';
import { Dispatch, DispatchInsert, DispatchUpdate } from '../types';

export async function getDispatches(): Promise<Dispatch[]> {
  const { data, error } = await supabase
    .from('dispatches')
    .select('*')
    .order('dispatch_date', { ascending: false });

  if (error) throw error;
  return data as Dispatch[];
}

export async function getDispatch(id: string): Promise<Dispatch | null> {
  const { data, error } = await supabase
    .from('dispatches')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Dispatch;
}

export async function createDispatch(dispatch: DispatchInsert): Promise<Dispatch> {
  const { data, error } = await supabase
    .from('dispatches')
    .insert(dispatch)
    .select()
    .single();

  if (error) throw error;
  return data as Dispatch;
}

export async function updateDispatch(id: string, updates: DispatchUpdate): Promise<Dispatch> {
  const { data, error } = await supabase
    .from('dispatches')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Dispatch;
}

export async function deleteDispatch(id: string): Promise<void> {
  const { error } = await supabase
    .from('dispatches')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
