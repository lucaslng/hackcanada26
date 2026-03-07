// VerificationStep.tsx

// import type { CapturedPhoto, VerificationResult } from '../../types';
// import { useFaceVerification } from '../../hooks/useFaceVerification';

// interface VerificationStepProps {
//   idPhoto: CapturedPhoto;
//   selfiePhoto: CapturedPhoto;
//   serviceColor: string;
//   onNext: (result: VerificationResult) => void;
//   onBack: () => void;
// }

// const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

// // Maps our hook status to the animated step list labels
// const STATUS_LABELS: Record<string, string> = {
//   'loading-models': 'Loading biometric models…',
//   analyzing: 'Enhancing images with Cloudinary…',
// };

// const ANALYSIS_STEPS = [
//   'Loading biometric models…',
//   'Enhancing images with Cloudinary…',
//   'Detecting facial landmarks…',
//   'Computing 128‑D face descriptor…',
//   'Calculating euclidean distance…',
//   'Generating confidence score…',
// ];

// export function VerificationStep({
//   idPhoto,
//   selfiePhoto,
//   serviceColor,
//   onNext,
//   onBack,
// }: VerificationStepProps) {
//   const { result, verify, reset } = useFaceVerification(CLOUD_NAME);

//   const isAnalyzing = result.status === 'loading-models' || result.status === 'analyzing';
//   const isDone = result.status === 'done';
//   const isFailed = result.status === 'failed' || (!result.passed && isDone);
//   const isError =
//     result.status === 'error' ||
//     result.status === 'no-face-id' ||
//     result.status === 'no-face-selfie';

//   // Map status → which step bullet is "active" in the animated list
//   const activeStep =
//     result.status === 'loading-models' ? 0
//       : result.status === 'analyzing' ? 2   // show halfway through while processing
//         : isDone ? ANALYSIS_STEPS.length
//           : 0;

//   const handleRun = () => {
//     verify(idPhoto.publicId, selfiePhoto.publicId);
//   };

//   const handleRetry = () => {
//     reset();
//   };

//   const handleContinue = () => {
//     if (!result.passed || result.similarity === null) return;
//     onNext({
//       passed: true,
//       confidence: result.similarity,
//       message: result.message,
//     });
//   };

//   const confidenceColor =
//     result.passed ? '#16a34a' : '#dc2626';

//   return (
//     <div className="wizard-step-content verification-step">
//       <div className="step-header">
//         <div
//           className="step-icon-circle"
//           style={{ background: `color-mix(in srgb, ${serviceColor} 12%, var(--surface))`, color: serviceColor }}
//         >
//           VR
//         </div>
//         <h2>Identity Verification</h2>
//         <p>
//           We enhance both images using Cloudinary, then run a real face-recognition model
//           (face-api.js) directly in your browser to compare the faces.
//         </p>
//       </div>

//       <div className="verification-layout">

//         {/* ── Photo comparison row ── */}
//         <div className="photo-compare-row">
//           <div className="compare-photo-card">
//             <div className="compare-photo-label">ID document photo</div>
//             <div className="compare-photo-frame" style={{ borderColor: serviceColor }}>
//               <img
//                 src={idPhoto.transformedUrl}
//                 alt="ID document face"
//                 style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
//               />
//             </div>
//             <div className="compare-photo-tag">Cloudinary face-extracted</div>
//           </div>

//           <div
//             className={`compare-vs-badge ${isAnalyzing ? 'pulsing' : ''}`}
//             style={
//               isDone && result.passed ? { color: '#16a34a' }
//                 : isDone && !result.passed ? { color: '#dc2626' }
//                   : { color: serviceColor }
//             }
//           >
//             {isDone && result.passed ? '✓' : isDone && !result.passed ? '✗' : isAnalyzing ? '⟳' : 'VS'}
//           </div>

//           <div className="compare-photo-card">
//             <div className="compare-photo-label">Live selfie</div>
//             <div className="compare-photo-frame" style={{ borderColor: serviceColor }}>
//               <img
//                 src={selfiePhoto.transformedUrl}
//                 alt="Live selfie face"
//                 style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
//               />
//             </div>
//             <div className="compare-photo-tag">Cloudinary AI enhanced</div>
//           </div>
//         </div>

//         {/* ── Idle: prompt to start ── */}
//         {result.status === 'idle' && (
//           <div className="verify-idle-panel">
//             <p className="verify-idle-desc">
//               Click <strong>Run Verification</strong> to enhance both images via Cloudinary and then
//               run a real neural-network face comparison — entirely in your browser. No data is sent
//               to any external verification API.
//             </p>
//             <button
//               className="btn-step-primary"
//               style={{ background: serviceColor }}
//               onClick={handleRun}
//             >
//               Run Verification
//             </button>
//           </div>
//         )}

//         {/* ── Analyzing ── */}
//         {isAnalyzing && (
//           <div className="analyzing-panel">
//             <div className="analyzing-header">
//               <div className="analyzing-spinner" style={{ borderTopColor: serviceColor }} />
//               <strong>
//                 {STATUS_LABELS[result.status] ?? 'Analysing…'}
//               </strong>
//             </div>
//             <div className="analysis-steps-list">
//               {ANALYSIS_STEPS.map((label, i) => (
//                 <div
//                   key={i}
//                   className={`analysis-step-row ${i < activeStep ? 'done' : ''} ${i === activeStep ? 'active' : ''}`}
//                 >
//                   <span
//                     className="analysis-step-indicator"
//                     style={
//                       i < activeStep ? { color: '#16a34a' }
//                         : i === activeStep ? { color: serviceColor }
//                           : {}
//                     }
//                   >
//                     {i < activeStep ? '✓' : i === activeStep ? '⟳' : '○'}
//                   </span>
//                   <span>{label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ── Pass ── */}
//         {isDone && result.passed && result.similarity !== null && (
//           <div className="result-panel result-panel--pass">
//             <div className="result-icon result-icon--pass">✓</div>
//             <h3>Identity Verified</h3>
//             <p className="result-message">{result.message}</p>

//             <div className="confidence-meter">
//               <div className="confidence-label">
//                 <span>Match Confidence</span>
//                 <strong style={{ color: confidenceColor }}>{result.similarity}%</strong>
//               </div>
//               <div className="confidence-bar-bg">
//                 <div
//                   className="confidence-bar-fill"
//                   style={{ width: `${result.similarity}%`, background: confidenceColor }}
//                 />
//               </div>
//             </div>

//             {result.distance !== null && (
//               <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
//                 Euclidean distance: <strong>{result.distance}</strong>
//                 &nbsp;(threshold&nbsp;≤&nbsp;0.55)
//               </p>
//             )}

//             <button
//               className="btn-step-primary"
//               style={{ background: serviceColor, marginTop: '0.5rem' }}
//               onClick={handleContinue}
//             >
//               Continue to documents
//             </button>
//           </div>
//         )}

//         {/* ── Fail: similarity too low ── */}
//         {isDone && !result.passed && result.similarity !== null && (
//           <div className="result-panel result-panel--fail">
//             <div className="result-icon result-icon--fail">✗</div>
//             <h3>Verification Failed</h3>
//             <p className="result-message">{result.message}</p>

//             <div className="confidence-meter">
//               <div className="confidence-label">
//                 <span>Match Confidence</span>
//                 <strong style={{ color: '#dc2626' }}>{result.similarity}%</strong>
//               </div>
//               <div className="confidence-bar-bg">
//                 <div
//                   className="confidence-bar-fill"
//                   style={{ width: `${result.similarity}%`, background: '#dc2626' }}
//                 />
//               </div>
//             </div>

//             {result.distance !== null && (
//               <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
//                 Euclidean distance: <strong>{result.distance}</strong>
//                 &nbsp;(threshold&nbsp;≤&nbsp;0.55)
//               </p>
//             )}

//             <p className="result-retry-hint">
//               Ensure your selfie closely matches the face on your ID — same lighting and direct gaze.
//             </p>
//             <button className="btn-step-secondary" onClick={onBack}>
//               Retake photos
//             </button>
//           </div>
//         )}

//         {/* ── Error / no face detected ── */}
//         {isError && (
//           <div className="result-panel result-panel--fail">
//             <div className="result-icon result-icon--fail" style={{ fontSize: '1.5rem' }}>!</div>
//             <h3>
//               {result.status === 'no-face-id'
//                 ? 'No Face Found in ID'
//                 : result.status === 'no-face-selfie'
//                   ? 'No Face Found in Selfie'
//                   : 'Verification Error'}
//             </h3>
//             <p className="result-message">{result.message}</p>
//             <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
//               <button className="btn-step-secondary" onClick={handleRetry}>
//                 Try Again
//               </button>
//               <button className="btn-step-secondary" onClick={onBack}>
//                 Retake photos
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {result.status === 'idle' && (
//         <div className="step-actions">
//           <button className="btn-step-secondary" onClick={onBack}>
//             Back
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
