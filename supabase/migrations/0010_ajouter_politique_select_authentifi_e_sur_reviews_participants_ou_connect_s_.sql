CREATE POLICY "Authenticated users can view reviews" ON public.reviews 
FOR SELECT TO authenticated USING (true);