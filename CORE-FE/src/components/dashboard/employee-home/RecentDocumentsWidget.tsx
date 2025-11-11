// import { FileText, File, Image, FileSpreadsheet, FileCode, ArrowRight } from 'lucide-react';
// import { Link } from 'react-router-dom';

// export interface Document {
//     id: string;
//     name: string;
//     type: string;
//     lastAccessed: Date;
//     sharedBy?: string;
// }

// interface RecentDocumentsWidgetProps {
//     documents: Document[];
//     isLoading?: boolean;
// }

// const RecentDocumentsWidget = ({ documents, isLoading = false }: RecentDocumentsWidgetProps) => {
//     const getDocumentIcon = (type: string) => {
//         const lowerType = type.toLowerCase();
//         if (lowerType.includes('pdf') || lowerType.includes('doc')) {
//             return <FileText className="w-4 h-4" />;
//         } else if (lowerType.includes('image') || lowerType.includes('png') || lowerType.includes('jpg')) {
//             return <Image className="w-4 h-4" />;
//         } else if (lowerType.includes('spreadsheet') || lowerTy