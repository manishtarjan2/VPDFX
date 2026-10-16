import fitz

doc = fitz.open()
page = doc.new_page()
page.insert_text((50, 50), "Page 1", fontsize=11)
doc.save("test_input.pdf")

doc2 = fitz.open("test_input.pdf")
page = doc2[0]
blocks = page.get_text("blocks")
for b in blocks:
    if "Page 1" in b[4]:
        page.add_redact_annot(fitz.Rect(b[:4]), fill=(1,1,1))
        page.apply_redactions()
doc2.save("test_output.pdf")
print("Done. Blocks found:", len(blocks))
