import re

path = "/home/user/workspace/paed-mh/index.html"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old = '''                <section id="sec-suicide" class="bg-red-50 p-5 rounded-xl shadow-sm border-2 border-red-600 border-l-[10px] border-l-red-700">
                    <h3 class="text-xl font-black text-red-800 mb-1">S \u2014 Suicide &amp; Self-Harm <span class="text-xs bg-red-700 text-white px-2 py-0.5 rounded ml-1 align-middle">HIGH PRIORITY</span></h3>
                    <p class="text-xs text-red-700 font-medium mb-3">Have you had thoughts of harming yourself or ending your life? Have you done anything to hurt yourself? When did this happen? How? What were you thinking/feeling? Do you have a plan? Access to means? Intent to act?</p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer"><input type="checkbox" id="sh_current_si" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-semibold">Current SI</span></label>
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer"><input type="checkbox" id="sh_previous_si" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-semibold">Previous SI</span></label>
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer"><input type="checkbox" id="sh_current_sh" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-semibold">Current SH</span></label>
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer"><input type="checkbox" id="sh_previous_sh" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-semibold">Previous SH</span></label>
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer"><input type="checkbox" id="sh_plan" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-semibold">Plan present</span></label>
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer"><input type="checkbox" id="sh_means" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-semibold">Access to means</span></label>
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer col-span-2"><input type="checkbox" id="sh_protective" class="w-4 h-4 text-green-600 rounded"><span class="text-xs font-semibold">Protective factors identified</span></label>
                    </div>
                    <textarea id="hs_suicide" rows="3" class="w-full px-3 py-2 border border-red-300 rounded-md text-sm bg-white" placeholder="Clinician findings \u2014 detail, timeline, lethality, intent..."></textarea>
                </section>'''

assert old in content, "OLD BLOCK NOT FOUND"

new = '''                <section id="sec-suicide" class="bg-red-50 p-5 rounded-xl shadow-sm border-2 border-red-600 border-l-[10px] border-l-red-700">
                    <h3 class="text-xl font-black text-red-800 mb-1">S \u2014 Suicide &amp; Self-Harm <span class="text-xs bg-red-700 text-white px-2 py-0.5 rounded ml-1 align-middle">HIGH PRIORITY</span></h3>
                    <p class="text-xs text-red-700 font-medium mb-3">Have you had thoughts of harming yourself or ending your life? Have you done anything to hurt yourself? When did this happen? How? What were you thinking/feeling? Do you have a plan? Access to means? Intent to act?</p>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer"><input type="checkbox" id="sh_current_si" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-semibold">Current SI</span></label>
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer"><input type="checkbox" id="sh_previous_si" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-semibold">Previous SI</span></label>
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer"><input type="checkbox" id="sh_current_sh" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-semibold">Current SH</span></label>
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer"><input type="checkbox" id="sh_previous_sh" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-semibold">Previous SH</span></label>
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer"><input type="checkbox" id="sh_plan" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-semibold">Plan present</span></label>
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer"><input type="checkbox" id="sh_means" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-semibold">Access to means</span></label>
                        <label class="flex items-center space-x-2 bg-white border border-red-300 rounded p-2 cursor-pointer col-span-2"><input type="checkbox" id="sh_protective" class="w-4 h-4 text-green-600 rounded"><span class="text-xs font-semibold">Protective factors identified</span></label>
                    </div>

                    <div class="bg-white p-3 rounded-lg border border-red-200 mb-3">
                        <span class="block text-xs font-bold text-red-800 uppercase mb-2">Form of Self-Harm (Partners in Paediatrics 2025-28)</span>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" class="sh-form-check w-4 h-4 text-red-600 rounded" value="Cutting/burning"><span class="text-xs">Cutting / burning</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" class="sh-form-check w-4 h-4 text-red-600 rounded" value="Self-poisoning"><span class="text-xs">Self-poisoning</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" class="sh-form-check w-4 h-4 text-red-600 rounded" value="Punching objects"><span class="text-xs">Punching objects</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" class="sh-form-check w-4 h-4 text-red-600 rounded" value="Self-strangulation"><span class="text-xs">Self-strangulation</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" class="sh-form-check w-4 h-4 text-red-600 rounded" value="Hair-pulling"><span class="text-xs">Hair-pulling</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" class="sh-form-check w-4 h-4 text-red-600 rounded" value="Scratching/picking"><span class="text-xs">Scratching / picking</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" class="sh-form-check w-4 h-4 text-red-600 rounded" value="Inhaling/sniffing harmful substances"><span class="text-xs">Inhaling / sniffing harmful substances</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" class="sh-form-check w-4 h-4 text-red-600 rounded" value="Swallowing non-food substances"><span class="text-xs">Swallowing non-food substances</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" class="sh-form-check w-4 h-4 text-red-600 rounded" value="Inserting objects"><span class="text-xs">Inserting objects</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" class="sh-form-check w-4 h-4 text-red-600 rounded" value="Head banging"><span class="text-xs">Head banging</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" class="sh-form-check w-4 h-4 text-red-600 rounded" value="Deliberately restricting oral/fluid intake"><span class="text-xs">Deliberately restricting oral/fluid intake</span></label>
                        </div>
                    </div>

                    <textarea id="hs_suicide" rows="3" class="w-full px-3 py-2 border border-red-300 rounded-md text-sm bg-white mb-3" placeholder="Clinician findings \u2014 detail, timeline, lethality, intent..."></textarea>

                    <div class="bg-white p-3 rounded-lg border border-red-200 mb-3">
                        <span class="block text-xs font-bold text-red-800 uppercase mb-2">Assessment Coverage (per hospital guideline)</span>
                        <p class="text-[11px] text-slate-500 font-medium mb-2">Remorse/regret \u00b7 Who knows \u00b7 Frequency \u00b7 Risk from others \u00b7 Stressors (bullying, bereavement, relationships, abuse, sexuality) \u00b7 Drugs/alcohol \u00b7 Education \u00b7 Family/social \u00b7 Support network \u00b7 Child protection</p>
                        <textarea id="sh_assessment_coverage" rows="3" class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="Document findings against each area above..."></textarea>
                    </div>

                    <div class="bg-red-100 p-3 rounded-lg border-2 border-red-400 mb-3">
                        <span class="block text-xs font-bold text-red-900 uppercase mb-2">Priority Referral Team (PRT) Criteria</span>
                        <p class="text-[11px] text-red-800 font-medium mb-2">Deliberate SH (overdose, self-strangulation, serious cuts) \u00b7 Deliberate harm from substance misuse with SH intent \u00b7 MH symptoms: depression/active suicidality, psychotic symptoms, aggression/severe agitation \u00b7 Low weight anorexia (BMI &lt;17.5 or rapid weight loss). If met, refer ASAP for same-day review.</p>
                        <div class="flex items-center gap-4">
                            <label class="flex items-center space-x-2 cursor-pointer bg-white px-3 py-2 border border-red-300 rounded"><input type="checkbox" id="sh_prt_criteria_met" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-bold">PRT Criteria Met</span></label>
                            <label class="flex items-center space-x-2 cursor-pointer bg-white px-3 py-2 border border-red-300 rounded"><input type="checkbox" id="sh_prt_referral_made" class="w-4 h-4 text-red-600 rounded"><span class="text-xs font-bold">Same-Day PRT Referral Made</span></label>
                        </div>
                    </div>

                    <div class="bg-white p-3 rounded-lg border border-red-200 mb-3">
                        <span class="block text-xs font-bold text-red-800 uppercase mb-2">Management Pathway</span>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">CAMHS Crisis / Liaison Contacted?</label>
                                <select id="sh_camhs_crisis" class="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white">
                                    <option value="">Select...</option>
                                    <option>Yes \u2014 Crisis Team</option>
                                    <option>Yes \u2014 Liaison Team</option>
                                    <option>Not available \u2014 admitted overnight</option>
                                    <option>Not required</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Section 136?</label>
                                <select id="sh_section136" class="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white">
                                    <option value="">Select...</option>
                                    <option>Yes \u2014 Police accompanied, CAMHS crisis/on-call contacted</option>
                                    <option>No</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-3 rounded-lg border border-red-200">
                        <span class="block text-xs font-bold text-red-800 uppercase mb-2">Consent for CAMHS Referral</span>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Consent Given By</label>
                                <select id="sh_consent_by" class="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white">
                                    <option value="">Select...</option>
                                    <option>Parent/Carer with parental responsibility</option>
                                    <option>Young person (Gillick competent)</option>
                                    <option>Not obtained</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Consent Obtained By (name/role)</label>
                                <input type="text" id="sh_consent_obtained_by" class="w-full px-3 py-2 border border-slate-300 rounded text-sm">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Date/Time Consent Obtained</label>
                                <input type="datetime-local" id="sh_consent_datetime" class="w-full px-3 py-2 border border-slate-300 rounded text-sm">
                            </div>
                        </div>
                    </div>
                </section>'''

content = content.replace(old, new)
with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("PATCH 1 APPLIED OK")
