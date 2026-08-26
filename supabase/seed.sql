begin;

insert into public.staff_profiles (id, user_id, display_name, email, role, status, last_active_at) values
('10000000-0000-0000-0000-000000000001','11000000-0000-0000-0000-000000000001','Mika Santos','mika.admin@sidequest.demo','super_admin','active',now()),
('10000000-0000-0000-0000-000000000002','11000000-0000-0000-0000-000000000002','Theo Cruz','theo.content@sidequest.demo','content_admin','active',now() - interval '8 minutes'),
('10000000-0000-0000-0000-000000000003','11000000-0000-0000-0000-000000000003','Aya Lim','aya.mod@sidequest.demo','moderator','active',now() - interval '22 minutes'),
('10000000-0000-0000-0000-000000000004','11000000-0000-0000-0000-000000000004','Noah Reyes','noah.data@sidequest.demo','analyst','active',now() - interval '1 hour')
on conflict (id) do nothing;

insert into public.tags (id, kind, name, slug, description, color, sort_order) values
('20000000-0000-0000-0000-000000000001','vibe','Quiet Focus','quiet-focus','Low-noise spaces for deep work.','#6F7D67',1),
('20000000-0000-0000-0000-000000000002','vibe','Soft Hours','soft-hours','Warm, unhurried café energy.','#9C85C8',2),
('20000000-0000-0000-0000-000000000003','vibe','Main Character','main-character','A photogenic scene with personality.','#A86648',3),
('20000000-0000-0000-0000-000000000004','use_case','Study Date','study-date','Tables, Wi-Fi, and enough time to settle in.','#7D6558',4),
('20000000-0000-0000-0000-000000000005','amenity','Power Outlets','power-outlets','Reliable access to charging.','#516B5B',5),
('20000000-0000-0000-0000-000000000006','dietary','Plant Friendly','plant-friendly','Meaningful plant-based choices.','#718C65',6)
on conflict (id) do nothing;

insert into public.cafes (id,name,slug,description,status,price_level,estimated_spend_min,estimated_spend_max,published_at,created_by,updated_by) values
('30000000-0000-0000-0000-000000000001','Soft Hours Coffee','soft-hours-coffee','Sunlit corners, thoughtful drinks, and a calm soundtrack for slow afternoons.','published',2,120,350,now()-interval '90 days','10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000002','Common Room','common-room','A roomy neighborhood café made for group study sessions and catch-ups.','published',2,100,320,now()-interval '75 days','10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000003','Afterglow','afterglow','Moody evening coffee, vinyl selections, and a small late-night dessert menu.','published',3,180,520,now()-interval '60 days','10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000004','Kape Sinta','kape-sinta','Filipino flavors meet playful seasonal drinks in a warm terracotta room.','published',2,110,380,now()-interval '45 days','10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000005','Daydream Department','daydream-department','Editorial interiors and rotating single-origin coffee for design-minded explorers.','published',3,190,650,now()-interval '30 days','10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000006','Tiny Table','tiny-table','An intimate eight-seat espresso bar with a concise pastry counter.','draft',2,90,280,null,'10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000007','Northbound Brew','northbound-brew','A practical stop for commuters with fast service and dependable Wi-Fi.','draft',1,80,220,null,'10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000008','Old Press Café','old-press-cafe','Archived demo listing retained to prove safe restoration and historical reporting.','archived',2,100,300,now()-interval '200 days','10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002')
on conflict (id) do nothing;

insert into public.cafe_branches (id,cafe_id,label,address,city,latitude,longitude,wifi_available,outlets_available) values
('31000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Kapitolyo','21 East Capitol Drive, Kapitolyo','Pasig',14.572200,121.060900,true,true),
('31000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','Maginhawa','88 Maginhawa Street, Teachers Village','Quezon City',14.646200,121.052500,true,true),
('31000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','Poblacion','15 Polaris Street, Poblacion','Makati',14.565300,121.029200,true,false),
('31000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000004','Cubao Expo','3 General Romulo Avenue, Cubao','Quezon City',14.620100,121.056700,true,true),
('31000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000005','Legazpi Village','109 Gamboa Street, Legazpi Village','Makati',14.554900,121.017800,true,true),
('31000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000006','Main','7 Scout Rallos Street','Quezon City',14.634000,121.031700,true,false),
('31000000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000007','EDSA','221 EDSA, Wack-Wack','Mandaluyong',14.593300,121.053900,true,true),
('31000000-0000-0000-0000-000000000008','30000000-0000-0000-0000-000000000008','Escolta','45 Escolta Street','Manila',14.596800,120.978500,false,false)
on conflict (id) do nothing;

insert into public.cafe_hours (branch_id,day_of_week,opens_at,closes_at)
select b.id, d, '08:00'::time, case when d in (5,6) then '23:00'::time else '21:00'::time end
from public.cafe_branches b cross join generate_series(0,6) d
on conflict (branch_id,day_of_week) do nothing;

insert into public.cafe_photos (id,cafe_id,storage_path,alt_text,moderation_status,sort_order) values
('32000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','demo/soft-hours.jpg','Sunlight across a wood café table','approved',1),
('32000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','demo/common-room.jpg','Long shared study table','approved',1),
('32000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','demo/afterglow.jpg','Amber-lit coffee bar at night','approved',1),
('32000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000004','demo/kape-sinta.jpg','Terracotta counter with local pastries','approved',1),
('32000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000005','demo/daydream.jpg','Editorial café seating and plants','approved',1),
('32000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000006','demo/tiny-table.jpg','Small espresso bar awaiting review','pending',1)
on conflict (id) do nothing;

insert into public.cafe_tags (cafe_id,tag_id)
select c.id, t.id from public.cafes c cross join public.tags t
where c.status='published' and t.slug in ('soft-hours','study-date','power-outlets')
on conflict do nothing;

insert into public.quests (id,title,slug,status,current_version,starts_at,ends_at,created_by) values
('40000000-0000-0000-0000-000000000001','The Purple Drink','the-purple-drink','active',1,now()-interval '7 days',now()+interval '30 days','10000000-0000-0000-0000-000000000002'),
('40000000-0000-0000-0000-000000000002','Three Stops Away','three-stops-away','active',1,now()-interval '2 days',now()+interval '14 days','10000000-0000-0000-0000-000000000002'),
('40000000-0000-0000-0000-000000000003','Study Date Roulette','study-date-roulette','scheduled',1,now()+interval '2 days',now()+interval '20 days','10000000-0000-0000-0000-000000000002'),
('40000000-0000-0000-0000-000000000004','Order For Each Other','order-for-each-other','draft',1,null,null,'10000000-0000-0000-0000-000000000002'),
('40000000-0000-0000-0000-000000000005','Golden Hour Table','golden-hour-table','paused',1,now()-interval '10 days',now()+interval '10 days','10000000-0000-0000-0000-000000000002'),
('40000000-0000-0000-0000-000000000006','One Photo Only','one-photo-only','archived',1,now()-interval '60 days',now()-interval '20 days','10000000-0000-0000-0000-000000000002')
on conflict (id) do nothing;

insert into public.quest_versions (id,quest_id,version,description,difficulty,duration_minutes,xp_reward,safety_message,proof_rule,rare_condition,published_at,created_by)
select case q.id
    when '40000000-0000-0000-0000-000000000001' then '41000000-0000-0000-0000-000000000001'::uuid
    when '40000000-0000-0000-0000-000000000002' then '41000000-0000-0000-0000-000000000002'::uuid
    when '40000000-0000-0000-0000-000000000003' then '41000000-0000-0000-0000-000000000003'::uuid
    when '40000000-0000-0000-0000-000000000004' then '41000000-0000-0000-0000-000000000004'::uuid
    when '40000000-0000-0000-0000-000000000005' then '41000000-0000-0000-0000-000000000005'::uuid
    else '41000000-0000-0000-0000-000000000006'::uuid
  end,
  q.id, 1,
  'Complete a playful café discovery prompt with your group.',
  case when q.slug='three-stops-away' then 'hard' else 'easy' end,
  case when q.slug='three-stops-away' then 120 else 60 end,
  case when q.slug='three-stops-away' then 240 else 120 end,
  'Stay aware of your surroundings and respect café staff and guests.',
  'Submit one in-app photo without photographing strangers.',
  case when q.slug='the-purple-drink' then 'Find a naturally purple drink.' else null end,
  case when q.status in ('active','scheduled','paused','archived') then now()-interval '10 days' else null end,
  '10000000-0000-0000-0000-000000000002'
from public.quests q
on conflict (quest_id,version) do nothing;

insert into public.quest_objectives (id,quest_version_id,instruction,sort_order,is_required) values
('42000000-0000-0000-0000-000000000001','41000000-0000-0000-0000-000000000001','Find a café you have never visited before.',1,true),
('42000000-0000-0000-0000-000000000002','41000000-0000-0000-0000-000000000001','Order a drink you have never tried.',2,true),
('42000000-0000-0000-0000-000000000003','41000000-0000-0000-0000-000000000002','Ride public transport for three stops.',1,true),
('42000000-0000-0000-0000-000000000004','41000000-0000-0000-0000-000000000002','Pick a nearby café none of you recognize.',2,true),
('42000000-0000-0000-0000-000000000005','41000000-0000-0000-0000-000000000003','Match with a study-friendly café.',1,true),
('42000000-0000-0000-0000-000000000006','41000000-0000-0000-0000-000000000004','Choose one drink for your quest partner.',1,true),
('42000000-0000-0000-0000-000000000007','41000000-0000-0000-0000-000000000005','Arrive during the final hour of daylight.',1,true),
('42000000-0000-0000-0000-000000000008','41000000-0000-0000-0000-000000000006','Capture one photo that tells the whole story.',1,true)
on conflict (id) do nothing;

insert into public.app_users (id,username,display_name,email,status,xp_total) values
('50000000-0000-0000-0000-000000000001','kaioutside','Kai Dela Cruz','kai@example.test','active',1380),
('50000000-0000-0000-0000-000000000002','beaafterclass','Bea Ramos','bea@example.test','warned',820),
('50000000-0000-0000-0000-000000000003','julesfinds','Jules Tan','jules@example.test','active',2240),
('50000000-0000-0000-0000-000000000004','samwanders','Sam Yu','sam@example.test','suspended',410)
on conflict (id) do nothing;

insert into public.reviews (id,cafe_id,user_id,rating,body,status) values
('60000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001',5,'Quiet enough to finish a whole paper, and the staff were lovely.','visible'),
('60000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000003','50000000-0000-0000-0000-000000000002',2,'The playlist was great but this review contains a reported personal attack.','hidden')
on conflict (id) do nothing;

insert into public.reports (id,reporter_user_id,subject_type,subject_id,category,summary,private_evidence_path,priority,status,assigned_to,resolved_at) values
('70000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','review','60000000-0000-0000-0000-000000000002','harassment','Review targets another user with insulting language.','private/reports/r1.png','high','open',null,null),
('70000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000003','user','50000000-0000-0000-0000-000000000004','unsafe_behavior','Repeated unwanted contact after a group quest.','private/reports/r2.txt','urgent','in_review','10000000-0000-0000-0000-000000000003',null),
('70000000-0000-0000-0000-000000000003','50000000-0000-0000-0000-000000000002','cafe_photo','32000000-0000-0000-0000-000000000006','privacy','Photo includes an identifiable stranger.','private/reports/r3.png','normal','actioned','10000000-0000-0000-0000-000000000003',now()-interval '1 day'),
('70000000-0000-0000-0000-000000000004','50000000-0000-0000-0000-000000000001','review','60000000-0000-0000-0000-000000000001','spam','Reporter reconsidered after review.','private/reports/r4.txt','low','dismissed','10000000-0000-0000-0000-000000000003',now()-interval '2 days')
on conflict (id) do nothing;

insert into public.achievements (id,name,slug,description,icon,rule_type,threshold,xp_reward) values
('80000000-0000-0000-0000-000000000001','First Sip','first-sip','Complete your first café quest.','coffee','quest_count',1,50),
('80000000-0000-0000-0000-000000000002','Neighborhood Regular','neighborhood-regular','Save ten café discoveries.','map-pin','cafe_count',10,150),
('80000000-0000-0000-0000-000000000003','Sidequest Energy','sidequest-energy','Reach 2,000 XP.','sparkles','xp_threshold',2000,200)
on conflict (id) do nothing;

insert into public.announcements (id,title,body,audience,status,scheduled_at,created_by) values
('90000000-0000-0000-0000-000000000001','Weekend quest drop','Two new café quests land this Saturday.', '{"city":"Metro Manila"}', 'scheduled', now()+interval '2 days','10000000-0000-0000-0000-000000000002'),
('90000000-0000-0000-0000-000000000002','Welcome to SIDEQUEST','Pick a vibe, set your budget, and let the city surprise you.', '{}', 'sent', null,'10000000-0000-0000-0000-000000000002')
on conflict (id) do nothing;

insert into public.entitlements (id,user_id,provider,provider_customer_id,plan,status,current_period_ends_at,provider_payload) values
('a0000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','stripe','cus_demo_kai','plus','active',now()+interval '21 days','{"demo":true}'),
('a0000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000003','stripe','cus_demo_jules','founder','active',now()+interval '365 days','{"demo":true}')
on conflict (id) do nothing;

commit;
