/*
  # Write access for the back-office

  The initial migration only granted public READ on le_labs_project. The
  back-office authenticates real users (magic-link / OTP) and needs to create,
  update and delete projects. This adds the corresponding grants + RLS policies
  for the `authenticated` role (and full access for `service_role`).
*/

-- Privileges (RLS still gates the rows).
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.le_labs_project TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.le_labs_project TO authenticated;
GRANT ALL ON public.le_labs_project TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'le_labs_project' AND policyname = 'Allow authenticated insert') THEN
    CREATE POLICY "Allow authenticated insert" ON public.le_labs_project
      FOR INSERT TO authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'le_labs_project' AND policyname = 'Allow authenticated update') THEN
    CREATE POLICY "Allow authenticated update" ON public.le_labs_project
      FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'le_labs_project' AND policyname = 'Allow authenticated delete') THEN
    CREATE POLICY "Allow authenticated delete" ON public.le_labs_project
      FOR DELETE TO authenticated USING (true);
  END IF;
END $$;
