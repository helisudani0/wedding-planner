
CREATE POLICY "family read files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'wedding-files');
CREATE POLICY "family upload files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'wedding-files');
CREATE POLICY "family update files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'wedding-files');
CREATE POLICY "family delete files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'wedding-files');
