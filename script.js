
function copyRichText() {
    var el = document.getElementById('epr-output');
    if (!el) return;
    var htmlContent = el.innerHTML;
    var plainText = el.innerText;
    var copyBtn = document.getElementById('copy-rich-text-btn');
    function flashBtn(ok) {
        if (!copyBtn) return;
        var orig = copyBtn.textContent;
        copyBtn.textContent = ok ? '\u2713 Copied!' : 'Copy failed';
        copyBtn.style.background = ok ? '#16a34a' : '#dc2626';
        setTimeout(function() {
            copyBtn.textContent = orig;
            copyBtn.style.background = '';
        }, 1500);
    }
    if (navigator.clipboard && window.ClipboardItem) {
        navigator.clipboard.write([
            new ClipboardItem({
                'text/html':  new Blob([htmlContent], { type: 'text/html' }),
                'text/plain': new Blob([plainText],  { type: 'text/plain' })
            })
        ]).then(function() { flashBtn(true); })
          .catch(function() {
            navigator.clipboard.writeText(plainText)
                .then(function() { flashBtn(true); })
                .catch(function() { flashBtn(false); });
        });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(plainText)
            .then(function() { flashBtn(true); })
            .catch(function() { flashBtn(false); });
    } else {
        try {
            var range = document.createRange();
            range.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand('copy');
            sel.removeAllRanges();
            flashBtn(true);
        } catch(e) { flashBtn(false); }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const DATA_VERSION = '1.0';
    const STORAGE_KEY = 'paed_mh_data';

    // --- DATA STORE ---
    let data = {
        _version: DATA_VERSION,
        patient: {
            name: '', dob: '', age: '', gender: '', nhs: '', attending: '',
            presenting: '', time: '', referral: ''
        },
        safeguarding: {
            cpp: '', ss: '', lac: false,
            camhs: '', camhsTeam: '', camhsCoordinator: '',
            prevEd: '', prevAdmission: '', meds: ''
        },
        headsss: {
            home: '',
            education: '',
            activities: '',
            drugsCategory: '', drugs: '',
            depression: '', moodScore: 5,
            sexuality: '',
            suicide: {
                currentSI: false, previousSI: false, currentSH: false, previousSH: false,
                plan: false, means: false, protective: false, notes: '',
                forms: [], assessmentCoverage: '',
                prtCriteriaMet: false, prtReferralMade: false,
                camhsCrisis: '', section136: '',
                consentBy: '', consentObtainedBy: '', consentDateTime: ''
            },
            safety: {
                physical: false, emotional: false, sexual: false, exploitation: false,
                online: false, countylines: false, cse: false, notes: ''
            }
        },
        mse: {
            appearance: '', speech: '', speechNotes: '', mood: '', affect: '', thoughtForm: '',
            content: { si: false, hi: false, paranoid: false, obsessional: false, hallAuditory: false, hallVisual: false, delusions: false },
            perception: '', orientated: '', concentration: '', insight: '', riskSummary: ''
        },
        risk: { level: '', rationale: '' },
        plan: {
            bloods: [], ecg: '', sgReferral: '', sgReferralTo: '', camhsContacted: '',
            inpatient: '', bedRequested: '', disposition: '', safetyPlan: '',
            clinician: '', seniorReview: ''
        },
        outcome: {
            notes: '', time: '', infoGiven: '', followup: '', followupDetails: '', consent: '',
            dcMedicallyFit: false, dcPsychologicallyStable: false, dcCamhsPlan: false,
            dcSocialCareReferral: false, dcGpAware: false, dcSchoolNurseAware: false
        }
    };

    const getEl = (id) => document.getElementById(id);
    const getTime = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const getNow = () => new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    // --- LOCAL STORAGE ---
    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        const status = getEl('saveStatus');
        if (status) {
            status.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Saved';
            clearTimeout(window._saveTimeout);
            window._saveTimeout = setTimeout(() => {
                status.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Auto-save';
            }, 1200);
        }
    }

    function deepMerge(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key] || typeof target[key] !== 'object') target[key] = {};
                deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }

    function loadState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                data = deepMerge(data, parsed);
                restoreUI();
            } catch (e) { console.error('Error loading saved data', e); }
        }
    }

    function restoreUI() {
        const p = data;
        const setVal = (id, val) => { const el = getEl(id); if (el) el.value = val || ''; };
        const setCheck = (id, val) => { const el = getEl(id); if (el) el.checked = !!val; };
        const setRadio = (name, val) => { if (!val) return; const el = document.querySelector(`input[name="${name}"][value="${val}"]`); if (el) el.checked = true; };

        // Patient
        setVal('p_name', p.patient.name);
        setVal('p_dob', p.patient.dob);
        setVal('p_age', p.patient.age);
        setVal('p_gender', p.patient.gender);
        setVal('p_nhs', p.patient.nhs);
        setVal('p_attending', p.patient.attending);
        setVal('p_presenting', p.patient.presenting);
        setVal('p_time', p.patient.time);
        setVal('p_referral', p.patient.referral);

        // Safeguarding
        setRadio('sg_cpp', p.safeguarding.cpp);
        setRadio('sg_ss', p.safeguarding.ss);
        setCheck('sg_lac', p.safeguarding.lac);
        setRadio('sg_camhs', p.safeguarding.camhs);
        setVal('sg_camhs_team', p.safeguarding.camhsTeam);
        setVal('sg_camhs_coordinator', p.safeguarding.camhsCoordinator);
        if (p.safeguarding.camhs === 'Yes') getEl('sg_camhs_details').classList.remove('hidden');
        setVal('sg_prev_ed', p.safeguarding.prevEd);
        setRadio('sg_prev_admission', p.safeguarding.prevAdmission);
        setVal('sg_meds', p.safeguarding.meds);

        // HEADSSS
        setVal('hs_home', p.headsss.home);
        setVal('hs_education', p.headsss.education);
        setVal('hs_activities', p.headsss.activities);
        setVal('hs_drugs_category', p.headsss.drugsCategory);
        setVal('hs_drugs', p.headsss.drugs);
        setVal('hs_depression', p.headsss.depression);
        setVal('hs_mood_score', p.headsss.moodScore);
        getEl('hs_mood_display').textContent = p.headsss.moodScore;
        setVal('hs_sexuality', p.headsss.sexuality);

        setCheck('sh_current_si', p.headsss.suicide.currentSI);
        setCheck('sh_previous_si', p.headsss.suicide.previousSI);
        setCheck('sh_current_sh', p.headsss.suicide.currentSH);
        setCheck('sh_previous_sh', p.headsss.suicide.previousSH);
        setCheck('sh_plan', p.headsss.suicide.plan);
        setCheck('sh_means', p.headsss.suicide.means);
        setCheck('sh_protective', p.headsss.suicide.protective);
        setVal('hs_suicide', p.headsss.suicide.notes);
        (p.headsss.suicide.forms || []).forEach(f => { const chk = document.querySelector(`.sh-form-check[value="${f}"]`); if (chk) chk.checked = true; });
        setVal('sh_assessment_coverage', p.headsss.suicide.assessmentCoverage);
        setCheck('sh_prt_criteria_met', p.headsss.suicide.prtCriteriaMet);
        setCheck('sh_prt_referral_made', p.headsss.suicide.prtReferralMade);
        setVal('sh_camhs_crisis', p.headsss.suicide.camhsCrisis);
        setVal('sh_section136', p.headsss.suicide.section136);
        setVal('sh_consent_by', p.headsss.suicide.consentBy);
        setVal('sh_consent_obtained_by', p.headsss.suicide.consentObtainedBy);
        setVal('sh_consent_datetime', p.headsss.suicide.consentDateTime);

        setCheck('sf_physical', p.headsss.safety.physical);
        setCheck('sf_emotional', p.headsss.safety.emotional);
        setCheck('sf_sexual', p.headsss.safety.sexual);
        setCheck('sf_exploitation', p.headsss.safety.exploitation);
        setCheck('sf_online', p.headsss.safety.online);
        setCheck('sf_countylines', p.headsss.safety.countylines);
        setCheck('sf_cse', p.headsss.safety.cse);
        setVal('hs_safety', p.headsss.safety.notes);

        // MSE
        setVal('mse_appearance', p.mse.appearance);
        setVal('mse_speech', p.mse.speech);
        setVal('mse_speech_notes', p.mse.speechNotes);
        setVal('mse_mood', p.mse.mood);
        setVal('mse_affect', p.mse.affect);
        setVal('mse_thoughtform', p.mse.thoughtForm);
        setCheck('tc_si', p.mse.content.si);
        setCheck('tc_hi', p.mse.content.hi);
        setCheck('tc_paranoid', p.mse.content.paranoid);
        setCheck('tc_obsessional', p.mse.content.obsessional);
        setCheck('tc_hallauditory', p.mse.content.hallAuditory);
        setCheck('tc_hallvisual', p.mse.content.hallVisual);
        setCheck('tc_delusions', p.mse.content.delusions);
        setVal('mse_perception', p.mse.perception);
        setRadio('mse_orientated', p.mse.orientated);
        setRadio('mse_concentration', p.mse.concentration);
        setVal('mse_insight', p.mse.insight);
        setVal('mse_risksummary', p.mse.riskSummary);

        // Risk
        setRadio('risk_level', p.risk.level);
        setVal('risk_rationale', p.risk.rationale);

        // Plan
        p.plan.bloods.forEach(b => { const chk = document.querySelector(`.blood-check[value="${b}"]`); if (chk) chk.checked = true; });
        setRadio('mp_ecg', p.plan.ecg);
        setRadio('mp_sg_referral', p.plan.sgReferral);
        setVal('mp_sg_referral_to', p.plan.sgReferralTo);
        if (p.plan.sgReferral === 'Yes') getEl('mp_sg_referral_to').classList.remove('hidden');
        setVal('mp_camhs_contacted', p.plan.camhsContacted);
        setRadio('mp_inpatient', p.plan.inpatient);
        setRadio('mp_bed_requested', p.plan.bedRequested);
        if (p.plan.inpatient === 'Yes') getEl('mp_inpatient_bed_wrap').classList.remove('hidden');
        setVal('mp_disposition', p.plan.disposition);
        setRadio('mp_safety_plan', p.plan.safetyPlan);
        setVal('mp_clinician', p.plan.clinician);
        setVal('mp_senior_review', p.plan.seniorReview);

        // Outcome
        setVal('out_notes', p.outcome.notes);
        setVal('out_time', p.outcome.time);
        setRadio('out_info_given', p.outcome.infoGiven);
        setRadio('out_followup', p.outcome.followup);
        setVal('out_followup_details', p.outcome.followupDetails);
        setVal('out_consent', p.outcome.consent);
        setCheck('dc_medically_fit', p.outcome.dcMedicallyFit);
        setCheck('dc_psychologically_stable', p.outcome.dcPsychologicallyStable);
        setCheck('dc_camhs_plan', p.outcome.dcCamhsPlan);
        setCheck('dc_social_care_referral', p.outcome.dcSocialCareReferral);
        setCheck('dc_gp_aware', p.outcome.dcGpAware);
        setCheck('dc_school_nurse_aware', p.outcome.dcSchoolNurseAware);
    }

    // --- BIND HELPERS ---
    const bind = (id, obj, key) => { const el = getEl(id); if (el) el.addEventListener('input', e => { obj[key] = e.target.value; updateNotes(); }); };
    const bindChange = (id, obj, key) => { const el = getEl(id); if (el) el.addEventListener('change', e => { obj[key] = e.target.value; updateNotes(); }); };
    const bindCheck = (id, obj, key) => { const el = getEl(id); if (el) el.addEventListener('change', e => { obj[key] = e.target.checked; updateNotes(); }); };
    const bindRadioGroup = (name, obj, key) => { document.querySelectorAll(`input[name="${name}"]`).forEach(r => r.addEventListener('change', e => { obj[key] = e.target.value; updateNotes(); })); };

    function attachAllListeners() {
        // Patient
        bind('p_name', data.patient, 'name');
        bind('p_dob', data.patient, 'dob');
        bind('p_age', data.patient, 'age');
        bindChange('p_gender', data.patient, 'gender');
        bind('p_nhs', data.patient, 'nhs');
        bindChange('p_attending', data.patient, 'attending');
        bind('p_presenting', data.patient, 'presenting');
        bind('p_time', data.patient, 'time');
        bindChange('p_referral', data.patient, 'referral');

        // Safeguarding
        bindRadioGroup('sg_cpp', data.safeguarding, 'cpp');
        bindRadioGroup('sg_ss', data.safeguarding, 'ss');
        bindCheck('sg_lac', data.safeguarding, 'lac');
        document.querySelectorAll('input[name="sg_camhs"]').forEach(r => r.addEventListener('change', e => {
            data.safeguarding.camhs = e.target.value;
            getEl('sg_camhs_details').classList.toggle('hidden', e.target.value !== 'Yes');
            updateNotes();
        }));
        bind('sg_camhs_team', data.safeguarding, 'camhsTeam');
        bind('sg_camhs_coordinator', data.safeguarding, 'camhsCoordinator');
        bind('sg_prev_ed', data.safeguarding, 'prevEd');
        bindRadioGroup('sg_prev_admission', data.safeguarding, 'prevAdmission');
        bind('sg_meds', data.safeguarding, 'meds');

        // HEADSSS
        bind('hs_home', data.headsss, 'home');
        bind('hs_education', data.headsss, 'education');
        bind('hs_activities', data.headsss, 'activities');
        bindChange('hs_drugs_category', data.headsss, 'drugsCategory');
        bind('hs_drugs', data.headsss, 'drugs');
        bind('hs_depression', data.headsss, 'depression');
        getEl('hs_mood_score').addEventListener('input', e => {
            data.headsss.moodScore = e.target.value;
            getEl('hs_mood_display').textContent = e.target.value;
            updateNotes();
        });
        bind('hs_sexuality', data.headsss, 'sexuality');

        bindCheck('sh_current_si', data.headsss.suicide, 'currentSI');
        bindCheck('sh_previous_si', data.headsss.suicide, 'previousSI');
        bindCheck('sh_current_sh', data.headsss.suicide, 'currentSH');
        bindCheck('sh_previous_sh', data.headsss.suicide, 'previousSH');
        bindCheck('sh_plan', data.headsss.suicide, 'plan');
        bindCheck('sh_means', data.headsss.suicide, 'means');
        bindCheck('sh_protective', data.headsss.suicide, 'protective');
        bind('hs_suicide', data.headsss.suicide, 'notes');
        document.querySelectorAll('.sh-form-check').forEach(chk => chk.addEventListener('change', e => {
            if (e.target.checked) data.headsss.suicide.forms.push(e.target.value);
            else data.headsss.suicide.forms = data.headsss.suicide.forms.filter(x => x !== e.target.value);
            updateNotes();
        }));
        bind('sh_assessment_coverage', data.headsss.suicide, 'assessmentCoverage');
        bindCheck('sh_prt_criteria_met', data.headsss.suicide, 'prtCriteriaMet');
        bindCheck('sh_prt_referral_made', data.headsss.suicide, 'prtReferralMade');
        bindChange('sh_camhs_crisis', data.headsss.suicide, 'camhsCrisis');
        bindChange('sh_section136', data.headsss.suicide, 'section136');
        bindChange('sh_consent_by', data.headsss.suicide, 'consentBy');
        bind('sh_consent_obtained_by', data.headsss.suicide, 'consentObtainedBy');
        bind('sh_consent_datetime', data.headsss.suicide, 'consentDateTime');

        bindCheck('sf_physical', data.headsss.safety, 'physical');
        bindCheck('sf_emotional', data.headsss.safety, 'emotional');
        bindCheck('sf_sexual', data.headsss.safety, 'sexual');
        bindCheck('sf_exploitation', data.headsss.safety, 'exploitation');
        bindCheck('sf_online', data.headsss.safety, 'online');
        bindCheck('sf_countylines', data.headsss.safety, 'countylines');
        bindCheck('sf_cse', data.headsss.safety, 'cse');
        bind('hs_safety', data.headsss.safety, 'notes');

        // MSE
        bind('mse_appearance', data.mse, 'appearance');
        bindChange('mse_speech', data.mse, 'speech');
        bind('mse_speech_notes', data.mse, 'speechNotes');
        bind('mse_mood', data.mse, 'mood');
        bindChange('mse_affect', data.mse, 'affect');
        bindChange('mse_thoughtform', data.mse, 'thoughtForm');
        bindCheck('tc_si', data.mse.content, 'si');
        bindCheck('tc_hi', data.mse.content, 'hi');
        bindCheck('tc_paranoid', data.mse.content, 'paranoid');
        bindCheck('tc_obsessional', data.mse.content, 'obsessional');
        bindCheck('tc_hallauditory', data.mse.content, 'hallAuditory');
        bindCheck('tc_hallvisual', data.mse.content, 'hallVisual');
        bindCheck('tc_delusions', data.mse.content, 'delusions');
        bind('mse_perception', data.mse, 'perception');
        bindRadioGroup('mse_orientated', data.mse, 'orientated');
        bindRadioGroup('mse_concentration', data.mse, 'concentration');
        bindChange('mse_insight', data.mse, 'insight');
        bind('mse_risksummary', data.mse, 'riskSummary');

        // Risk
        bindRadioGroup('risk_level', data.risk, 'level');
        bind('risk_rationale', data.risk, 'rationale');

        // Plan
        document.querySelectorAll('.blood-check').forEach(chk => chk.addEventListener('change', e => {
            if (e.target.checked) data.plan.bloods.push(e.target.value);
            else data.plan.bloods = data.plan.bloods.filter(x => x !== e.target.value);
            updateNotes();
        }));
        bindRadioGroup('mp_ecg', data.plan, 'ecg');
        document.querySelectorAll('input[name="mp_sg_referral"]').forEach(r => r.addEventListener('change', e => {
            data.plan.sgReferral = e.target.value;
            getEl('mp_sg_referral_to').classList.toggle('hidden', e.target.value !== 'Yes');
            updateNotes();
        }));
        bind('mp_sg_referral_to', data.plan, 'sgReferralTo');
        bindChange('mp_camhs_contacted', data.plan, 'camhsContacted');
        document.querySelectorAll('input[name="mp_inpatient"]').forEach(r => r.addEventListener('change', e => {
            data.plan.inpatient = e.target.value;
            getEl('mp_inpatient_bed_wrap').classList.toggle('hidden', e.target.value !== 'Yes');
            updateNotes();
        }));
        bindRadioGroup('mp_bed_requested', data.plan, 'bedRequested');
        bindChange('mp_disposition', data.plan, 'disposition');
        bindRadioGroup('mp_safety_plan', data.plan, 'safetyPlan');
        bind('mp_clinician', data.plan, 'clinician');
        bind('mp_senior_review', data.plan, 'seniorReview');

        // Outcome
        bind('out_notes', data.outcome, 'notes');
        bind('out_time', data.outcome, 'time');
        bindRadioGroup('out_info_given', data.outcome, 'infoGiven');
        bindRadioGroup('out_followup', data.outcome, 'followup');
        bind('out_followup_details', data.outcome, 'followupDetails');
        bind('out_consent', data.outcome, 'consent');
        bindCheck('dc_medically_fit', data.outcome, 'dcMedicallyFit');
        bindCheck('dc_psychologically_stable', data.outcome, 'dcPsychologicallyStable');
        bindCheck('dc_camhs_plan', data.outcome, 'dcCamhsPlan');
        bindCheck('dc_social_care_referral', data.outcome, 'dcSocialCareReferral');
        bindCheck('dc_gp_aware', data.outcome, 'dcGpAware');
        bindCheck('dc_school_nurse_aware', data.outcome, 'dcSchoolNurseAware');

        // Print / Reset
        const printBtn = getEl('printBtn');
        if (printBtn) printBtn.addEventListener('click', () => window.print());

        getEl('resetData').addEventListener('click', () => {
            if (confirm('Reset form? All data will be lost.')) {
                localStorage.removeItem(STORAGE_KEY);
                location.reload();
            }
        });
    }

    // --- NOTE GENERATION ---
    function esc(str) {
        if (str === undefined || str === null) return '';
        return String(str);
    }

    function riskColour(level) {
        if (level === 'HIGH') return '#dc2626';
        if (level === 'MODERATE') return '#d97706';
        if (level === 'LOW') return '#16a34a';
        return '#334155';
    }

    function ph(text) {
        return `<span style="color:#94a3b8">[${text}]</span>`;
    }
    function normalTag() { return `<span style="color:#16a34a">Normal/Negative</span>`; }
    function fieldVal(v, placeholder) {
        return v ? esc(v) : ph(placeholder || 'not recorded');
    }
    function heading(text) {
        return `<br><b style="font-weight:bold;">${text}</b><br>`;
    }

    function updateNotes() {
        const p = data;
        const noteTime = getNow();
        let h = `<b style="font-weight:bold;">PAEDIATRIC MENTAL HEALTH ASSESSMENT</b> <span style="font-size:0.85em;color:#64748b;">(Note generated: ${noteTime})</span><br>`;

        // PATIENT DETAILS
        h += heading('PATIENT DETAILS');
        h += `Name: ${fieldVal(p.patient.name)} | DOB: ${fieldVal(p.patient.dob)} | Age: ${fieldVal(p.patient.age)} | Gender: ${fieldVal(p.patient.gender)}<br>`;
        h += `NHS Number: ${fieldVal(p.patient.nhs)} | Attending with: ${fieldVal(p.patient.attending)} | Referral: ${fieldVal(p.patient.referral)}<br>`;
        h += `Time of Presentation: ${fieldVal(p.patient.time)}<br>`;
        h += `Presenting complaint: ${fieldVal(p.patient.presenting)}<br>`;

        // SAFEGUARDING STATUS
        h += heading('SAFEGUARDING STATUS');
        const cppFlag = p.safeguarding.cpp === 'Yes'
            ? `<span style="color:#dc2626;font-weight:bold">⚠️ POSITIVE: Yes</span>`
            : (p.safeguarding.cpp === 'No' ? normalTag() : ph('not recorded'));
        h += `Child protection plan: ${cppFlag} | LAC: ${p.safeguarding.lac ? '<span style="color:#dc2626;font-weight:bold">⚠️ Yes</span>' : 'No'} | Known to social services: ${fieldVal(p.safeguarding.ss)}<br>`;
        let camhsLine = `CAMHS involvement: ${fieldVal(p.safeguarding.camhs)}`;
        if (p.safeguarding.camhs === 'Yes') camhsLine += ` (Team: ${fieldVal(p.safeguarding.camhsTeam)}, Coordinator: ${fieldVal(p.safeguarding.camhsCoordinator)})`;
        h += camhsLine + `<br>`;
        h += `Previous ED attendances (MH): ${p.safeguarding.prevEd ? esc(p.safeguarding.prevEd) : ph('not recorded')} | Previous MH admissions: ${fieldVal(p.safeguarding.prevAdmission)}<br>`;
        h += `Current medications: ${fieldVal(p.safeguarding.meds, 'none recorded')}<br>`;

        // HEADSSS ASSESSMENT
        h += heading('HEADSSS ASSESSMENT');
        h += `Home: ${fieldVal(p.headsss.home, 'not assessed')}<br>`;
        h += `Education/Employment: ${fieldVal(p.headsss.education, 'not assessed')}<br>`;
        h += `Activities: ${fieldVal(p.headsss.activities, 'not assessed')}<br>`;
        h += `Drugs &amp; Alcohol: ${fieldVal(p.headsss.drugsCategory, 'not assessed')}${p.headsss.drugs ? ' — ' + esc(p.headsss.drugs) : ''}<br>`;
        h += `Depression/Mental Health: ${fieldVal(p.headsss.depression, 'not assessed')} | Mood score: ${esc(p.headsss.moodScore) || ph('not recorded')}/10<br>`;
        h += `Sexuality &amp; Relationships: ${fieldVal(p.headsss.sexuality, 'not assessed')}<br>`;

        const shFlags = [];
        if (p.headsss.suicide.currentSI) shFlags.push('Current SI');
        if (p.headsss.suicide.previousSI) shFlags.push('Previous SI');
        if (p.headsss.suicide.currentSH) shFlags.push('Current SH');
        if (p.headsss.suicide.previousSH) shFlags.push('Previous SH');
        if (p.headsss.suicide.plan) shFlags.push('Plan present');
        if (p.headsss.suicide.means) shFlags.push('Access to means');
        if (p.headsss.suicide.protective) shFlags.push('Protective factors identified');
        const hasActiveRisk = p.headsss.suicide.currentSI || p.headsss.suicide.currentSH || p.headsss.suicide.plan || p.headsss.suicide.means;
        const shText = shFlags.length
            ? (hasActiveRisk ? `<span style="color:#dc2626;font-weight:bold">⚠️ POSITIVE: ${shFlags.join(', ')}</span>` : `<span style="color:#d97706;font-weight:bold">⚠️ ${shFlags.join(', ')}</span>`)
            : `<span style="color:#16a34a">None reported</span>`;
        h += `<b style="font-weight:bold;">⚠️ SUICIDE &amp; SELF-HARM:</b> ${shText}${p.headsss.suicide.notes ? ' — ' + esc(p.headsss.suicide.notes) : ''}<br>`;
        h += `&nbsp;&nbsp;Form(s) of self-harm: ${(p.headsss.suicide.forms && p.headsss.suicide.forms.length) ? esc(p.headsss.suicide.forms.join(', ')) : ph('not applicable')}<br>`;
        h += `&nbsp;&nbsp;Assessment coverage: ${fieldVal(p.headsss.suicide.assessmentCoverage)}<br>`;
        h += `&nbsp;&nbsp;PRT criteria met: ${p.headsss.suicide.prtCriteriaMet ? '<span style="color:#dc2626;font-weight:bold">⚠️ Yes</span>' : 'No'} | Same-day PRT referral made: ${p.headsss.suicide.prtReferralMade ? 'Yes' : 'No'}<br>`;
        h += `&nbsp;&nbsp;CAMHS crisis/liaison: ${fieldVal(p.headsss.suicide.camhsCrisis)}<br>`;
        h += `&nbsp;&nbsp;Section 136: ${fieldVal(p.headsss.suicide.section136)}<br>`;
        h += `&nbsp;&nbsp;Consent for CAMHS referral: ${fieldVal(p.headsss.suicide.consentBy)}`;
        h += ` (obtained by ${fieldVal(p.headsss.suicide.consentObtainedBy)}`;
        h += p.headsss.suicide.consentDateTime ? ` on ${esc(p.headsss.suicide.consentDateTime)})` : `)`;
        h += `<br>`;

        const sfFlags = [];
        if (p.headsss.safety.physical) sfFlags.push('Physical abuse concern');
        if (p.headsss.safety.emotional) sfFlags.push('Emotional abuse');
        if (p.headsss.safety.sexual) sfFlags.push('Sexual abuse');
        if (p.headsss.safety.exploitation) sfFlags.push('Exploitation');
        if (p.headsss.safety.online) sfFlags.push('Online safety concern');
        if (p.headsss.safety.countylines) sfFlags.push('County lines');
        if (p.headsss.safety.cse) sfFlags.push('CSE concern');
        const sfText = sfFlags.length
            ? `<span style="color:#dc2626;font-weight:bold">⚠️ POSITIVE: ${sfFlags.join(', ')}</span>`
            : `<span style="color:#16a34a">No concerns identified</span>`;
        h += `Safety: ${sfText}${p.headsss.safety.notes ? ' — ' + esc(p.headsss.safety.notes) : ''}<br>`;

        // MENTAL STATE EXAMINATION
        h += heading('MENTAL STATE EXAMINATION');
        h += `Appearance: ${fieldVal(p.mse.appearance)} | Speech: ${fieldVal(p.mse.speech)}${p.mse.speechNotes ? ' (' + esc(p.mse.speechNotes) + ')' : ''} | Mood: ${fieldVal(p.mse.mood)} | Affect: ${fieldVal(p.mse.affect)}<br>`;
        h += `Thought form: ${fieldVal(p.mse.thoughtForm)}<br>`;
        const tcFlags = [];
        if (p.mse.content.si) tcFlags.push('Suicidal ideation');
        if (p.mse.content.hi) tcFlags.push('Homicidal ideation');
        if (p.mse.content.paranoid) tcFlags.push('Paranoid ideation');
        if (p.mse.content.obsessional) tcFlags.push('Obsessional thoughts');
        if (p.mse.content.hallAuditory) tcFlags.push('Hallucinations (auditory)');
        if (p.mse.content.hallVisual) tcFlags.push('Hallucinations (visual)');
        if (p.mse.content.delusions) tcFlags.push('Delusions');
        const tcText = tcFlags.length
            ? `<span style="color:#dc2626;font-weight:bold">⚠️ POSITIVE: ${tcFlags.join(', ')}</span>`
            : `<span style="color:#16a34a">No abnormal thought content identified</span>`;
        h += `Thought content: ${tcText}<br>`;
        h += `Insight: ${fieldVal(p.mse.insight)}<br>`;
        h += `Risk summary: ${fieldVal(p.mse.riskSummary)}<br>`;

        // RISK STRATIFICATION
        h += heading('RISK STRATIFICATION');
        let riskText;
        if (p.risk.level === 'HIGH') riskText = `<span style="color:#dc2626;font-weight:bold">HIGH RISK</span>`;
        else if (p.risk.level === 'MODERATE') riskText = `<span style="color:#d97706;font-weight:bold">MODERATE RISK</span>`;
        else if (p.risk.level === 'LOW') riskText = `<span style="color:#16a34a;font-weight:bold">LOW RISK</span>`;
        else riskText = ph('not assessed');
        h += `Risk level: ${riskText}<br>`;
        h += `Rationale: ${fieldVal(p.risk.rationale)}<br>`;

        // MANAGEMENT PLAN
        h += heading('MANAGEMENT PLAN');
        h += `Bloods: ${p.plan.bloods.length ? esc(p.plan.bloods.join(', ')) : ph('none ordered')}<br>`;
        h += `ECG: ${fieldVal(p.plan.ecg)} | Safeguarding referral: ${fieldVal(p.plan.sgReferral)}${p.plan.sgReferral === 'Yes' && p.plan.sgReferralTo ? ' (to: ' + esc(p.plan.sgReferralTo) + ')' : ''} | CAMHS contacted: ${fieldVal(p.plan.camhsContacted)}<br>`;
        h += `Inpatient referral: ${fieldVal(p.plan.inpatient)}${p.plan.inpatient === 'Yes' ? ' (Bed requested: ' + fieldVal(p.plan.bedRequested) + ')' : ''}<br>`;
        h += `Disposition: ${fieldVal(p.plan.disposition)}<br>`;
        h += `Safety plan completed: ${fieldVal(p.plan.safetyPlan)}<br>`;

        h += `<br>Self-harm forms (if applicable): ${(p.headsss.suicide.forms && p.headsss.suicide.forms.length) ? esc(p.headsss.suicide.forms.join(', ')) : ph('not applicable')}<br>`;
        h += `PRT referral criteria met: ${p.headsss.suicide.prtCriteriaMet ? '<span style="color:#dc2626;font-weight:bold">⚠️ Yes</span>' : ph('none met')}<br>`;
        h += `Consent obtained: ${fieldVal(p.headsss.suicide.consentBy)} | Consented by: ${fieldVal(p.headsss.suicide.consentBy)} | Obtained by: ${fieldVal(p.headsss.suicide.consentObtainedBy)}<br>`;

        // OUTCOME & DISPOSITION
        h += heading('OUTCOME &amp; DISPOSITION');
        const dcFlags = [];
        if (p.outcome.dcMedicallyFit) dcFlags.push('Medically fit');
        if (p.outcome.dcPsychologicallyStable) dcFlags.push('Psychologically stable (PRT assessed)');
        if (p.outcome.dcCamhsPlan) dcFlags.push('CAMHS management plan in place');
        if (p.outcome.dcSocialCareReferral) dcFlags.push("Children's social care referral made");
        if (p.outcome.dcGpAware) dcFlags.push('GP informed');
        if (p.outcome.dcSchoolNurseAware) dcFlags.push('School nurse informed');
        h += `Discharge readiness: ${dcFlags.length ? esc(dcFlags.join(', ')) : ph('not yet assessed')}<br>`;
        h += `Outcome notes: ${fieldVal(p.outcome.notes)}<br>`;
        h += `Time of disposition: ${fieldVal(p.outcome.time)}<br>`;
        let fuLine = `Follow-up arranged: ${fieldVal(p.outcome.followup)}`;
        if (p.outcome.followup === 'Yes' && p.outcome.followupDetails) fuLine += ` — ${esc(p.outcome.followupDetails)}`;
        h += fuLine + `<br>`;
        h += `Information given to patient/carer: ${fieldVal(p.outcome.infoGiven)}<br>`;
        h += `Consent: ${fieldVal(p.outcome.consent)}<br>`;
        h += `Responsible clinician: ${fieldVal(p.plan.clinician)} | Senior review: ${fieldVal(p.plan.seniorReview)}<br>`;

        const eprEl = getEl('epr-output');
        if (eprEl) eprEl.innerHTML = h;
        saveState();
    }

    // --- INIT ---
    loadState();
    attachAllListeners();
    updateNotes();
});
