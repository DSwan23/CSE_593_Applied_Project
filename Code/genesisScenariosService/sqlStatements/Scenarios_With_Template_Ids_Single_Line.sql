Select s.*, group_concat(distinct t.pkey ORDER BY t.pkey ASC SEPARATOR ', ') as templates from genesis_scenarios.scenarios s
inner join genesis_scenarios.scenario_templates st on s.pkey = st.scenario_id
inner join genesis_scenarios.templates t on st.template_id = t.pkey
group by s.pkey;