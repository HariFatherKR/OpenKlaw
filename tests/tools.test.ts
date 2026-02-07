import { describe, it, expect } from 'vitest';
import { isHwpFile } from '../src/lib/tools/hwp-parser';

describe('HWP Parser', () => {
	it('should detect HWP files', () => {
		expect(isHwpFile('document.hwp')).toBe(true);
		expect(isHwpFile('report.HWP')).toBe(true);
		expect(isHwpFile('file.hwpx')).toBe(true);
	});

	it('should not detect non-HWP files', () => {
		expect(isHwpFile('document.docx')).toBe(false);
		expect(isHwpFile('file.pdf')).toBe(false);
		expect(isHwpFile('data.xlsx')).toBe(false);
	});
});
