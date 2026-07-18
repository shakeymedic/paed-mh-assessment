path = "/home/user/workspace/paed-mh/index.html"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old = '''                <section id="sec-outcome" class="p-5 rounded-xl shadow-sm border border-slate-300" style="background:#f0f9fa;">
                    <h2 class="text-lg font-black mb-4 flex items-center" style="color:#1B3A5C;">
                        <span class="w-1.5 h-6 mr-2 rounded-full" style="background:#1B3A5C;"></span>7. Outcome &amp; Disposition
                    </h2>

                    <div class="mb-4">
                        <label class="block text-xs font-bold text-slate-600 uppercase mb-1">Outcome Notes</label>
                        <textarea id="out_notes" rows="3" class="w-full px-3 py-2 border border-slate-400 rounded-md text-sm bg-white"></textarea>
                    </div>'''

new = '''                <section id="sec-outcome" class="p-5 rounded-xl shadow-sm border border-slate-300" style="background:#f0f9fa;">
                    <h2 class="text-lg font-black mb-4 flex items-center" style="color:#1B3A5C;">
                        <span class="w-1.5 h-6 mr-2 rounded-full" style="background:#1B3A5C;"></span>7. Outcome &amp; Disposition
                    </h2>

                    <div class="bg-white p-3 rounded-lg border-2 border-teal-300 mb-4">
                        <span class="block text-xs font-bold uppercase mb-2" style="color:#01696F;">Discharge Readiness Checklist (Partners in Paediatrics)</span>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" id="dc_medically_fit" class="w-4 h-4 text-teal-600 rounded"><span class="text-xs font-semibold">Medically fit for discharge</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" id="dc_psychologically_stable" class="w-4 h-4 text-teal-600 rounded"><span class="text-xs font-semibold">Psychologically stable (assessed by PRT)</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" id="dc_camhs_plan" class="w-4 h-4 text-teal-600 rounded"><span class="text-xs font-semibold">CAMHS management plan in place</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" id="dc_social_care_referral" class="w-4 h-4 text-teal-600 rounded"><span class="text-xs font-semibold">Children's social care referral made (if safety concerns)</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" id="dc_gp_aware" class="w-4 h-4 text-teal-600 rounded"><span class="text-xs font-semibold">GP informed</span></label>
                            <label class="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded p-2 cursor-pointer"><input type="checkbox" id="dc_school_nurse_aware" class="w-4 h-4 text-teal-600 rounded"><span class="text-xs font-semibold">School nurse informed</span></label>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-xs font-bold text-slate-600 uppercase mb-1">Outcome Notes</label>
                        <textarea id="out_notes" rows="3" class="w-full px-3 py-2 border border-slate-400 rounded-md text-sm bg-white"></textarea>
                    </div>'''

assert old in content, "OUTCOME BLOCK NOT FOUND"
content = content.replace(old, new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("PATCH 3 APPLIED OK")
