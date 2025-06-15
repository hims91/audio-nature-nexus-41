
-- Create a new storage bucket for user avatars
insert into storage.buckets
  (id, name, public)
values
  ('avatars', 'avatars', true);

-- Allow public read access to avatar images
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatar
create policy "Authenticated users can upload an avatar."
  on storage.objects for insert to authenticated
  with check ( bucket_id = 'avatars' and owner = auth.uid() );

-- Allow users to update their own avatar
create policy "Users can update their own avatars."
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'avatars' );

-- Allow users to delete their own avatar
create policy "Users can delete their own avatars."
  on storage.objects for delete
  using ( auth.uid() = owner );
