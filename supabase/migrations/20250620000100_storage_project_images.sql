/*
  # Storage bucket for project images (sovereign S3 / MinIO)

  Creates a public `project-images` bucket and the RLS policies on
  storage.objects so the public can read images and authenticated back-office
  users can upload / replace / delete them. Backed by MinIO in dev and a real
  S3 provider in prod (configured on the storage service via env).
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'project-images public read') THEN
    CREATE POLICY "project-images public read" ON storage.objects
      FOR SELECT TO public USING (bucket_id = 'project-images');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'project-images authenticated insert') THEN
    CREATE POLICY "project-images authenticated insert" ON storage.objects
      FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'project-images authenticated update') THEN
    CREATE POLICY "project-images authenticated update" ON storage.objects
      FOR UPDATE TO authenticated USING (bucket_id = 'project-images') WITH CHECK (bucket_id = 'project-images');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'project-images authenticated delete') THEN
    CREATE POLICY "project-images authenticated delete" ON storage.objects
      FOR DELETE TO authenticated USING (bucket_id = 'project-images');
  END IF;
END $$;
