Select s.*, group_concat(distinct t.pkey ORDER BY t.pkey ASC SEPARATOR ', ') as templates from genesis_scenarios.scenarios s
left join genesis_scenarios.scenario_templates st on s.pkey = st.scenario_id
left join genesis_scenarios.templates t on st.template_id = t.pkey
where s.pkey = 2 group by s.pkey ;