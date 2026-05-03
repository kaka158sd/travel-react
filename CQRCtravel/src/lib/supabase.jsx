//Supabase 项目 URL、API Key，以及初始化好的 supabase 客户端
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cjjcirgfuyytugwdyslf.supabase.co';
const supabaseAnonKey = 'sb_publishable_9ksdc-8S2UXE6Gfp1X89Xw_wLDm0VJc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
