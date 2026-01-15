"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExportDropdownProps {
    onExportPDF: () => void | Promise<void>;
    onExportExcel: () => void | Promise<void>;
    isExporting: boolean;
    className?: string;
}

export function ExportDropdown({ onExportPDF, onExportExcel, isExporting, className }: ExportDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <Button
                variant="outline"
                disabled={isExporting}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 md:px-4 py-2 min-h-[44px] bg-card text-muted-foreground rounded-lg hover:bg-muted transition-colors border border-border text-xs md:text-sm font-medium",
                    className
                )}
            >
                {isExporting ? (
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                    <Download className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Exportar</span>
                <ChevronDown className="w-3 h-3 opacity-50 ml-1" />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden py-1">
                        <button
                            onClick={() => {
                                onExportPDF();
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 flex items-center gap-2 hover:bg-muted transition-colors text-sm text-foreground"
                        >
                            <FileText className="w-4 h-4 text-red-500" />
                            <span>PDF (Documento)</span>
                        </button>
                        <button
                            onClick={() => {
                                onExportExcel();
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 flex items-center gap-2 hover:bg-muted transition-colors text-sm text-foreground"
                        >
                            <FileSpreadsheet className="w-4 h-4 text-green-600" />
                            <span>Excel (Planilha)</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
