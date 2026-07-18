path = "/home/user/workspace/paed-mh/index.html"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Rename the right-panel EPR output div id to epr-output, and the copy button id to copy-rich-text-btn
old_epr_section = '''                    <section class="bg-white p-4 rounded-xl shadow-lg border border-slate-300">
                        <div class="flex justify-between items-center mb-3">
                            <h2 class="text-sm font-bold text-slate-700 uppercase tracking-wide">EPR Note</h2>
                            <div class="flex gap-2">
                                <button id="copyRichText" class="px-3 py-1 text-xs font-bold text-white rounded hover:opacity-90 transition shadow-sm" style="background:#01696F;">Copy Rich Text</button>
                                <button onclick="window.print()" class="px-3 py-1 text-xs font-bold bg-slate-600 text-white rounded hover:bg-slate-700 transition shadow-sm">\U0001F5A8\uFE0F Print</button>
                            </div>
                        </div>
                        <div id="eprNoteOutput" contenteditable="true" class="rich-output focus:ring-2 ring-teal-500 ring-offset-2"></div>
                    </section>'''

new_epr_section = '''                    <section class="bg-white p-4 rounded-xl shadow-lg border border-slate-300">
                        <div class="flex justify-between items-center mb-3">
                            <h2 class="text-sm font-bold text-slate-700 uppercase tracking-wide">EPR Note</h2>
                            <div class="flex gap-2">
                                <button id="copy-rich-text-btn" onclick="copyRichText()" class="px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded hover:opacity-90 transition shadow-sm">Copy Rich Text</button>
                                <button onclick="window.print()" class="px-3 py-1 text-xs font-bold bg-slate-600 text-white rounded hover:bg-slate-700 transition shadow-sm">\U0001F5A8\uFE0F Print</button>
                            </div>
                        </div>
                        <div id="epr-output" contenteditable="true" class="rich-output focus:ring-2 ring-teal-500 ring-offset-2"></div>
                    </section>'''

assert old_epr_section in content, "EPR SECTION NOT FOUND"
content = content.replace(old_epr_section, new_epr_section)

# 2. Move script.js from head-referenced defer tag to just before </body>, remove from wherever it currently is
old_script_tag = '    <script src="script.js" defer></script>\n</body>\n</html>'
new_script_tag = '    <script src="script.js"></script>\n</body>\n</html>'
assert old_script_tag in content, "SCRIPT TAG BLOCK NOT FOUND"
content = content.replace(old_script_tag, new_script_tag)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("PATCH 2 APPLIED OK")
