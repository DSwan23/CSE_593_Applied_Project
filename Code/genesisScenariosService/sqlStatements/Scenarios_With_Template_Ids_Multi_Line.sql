select s.*, t.pkey from genesis_scenarios.scenarios s
join genesis_scenarios.scenario_templates st on s.pkey = st.scenario_id
join genesis_scenarios.templates t on st.template_id = t.pkey;