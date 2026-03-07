import { useMemo, useState } from 'react';

type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';
type RejectReason = 'Document incomplete' | 'Mismatch in ID' | 'Blurry photo' | 'Other';

type DocumentThumbnails = {
  passportScan: string;
  selfie: string;
  proofOfId: string;
};

type ReviewLog = {
  reviewerId: string;
  timestamp: string;
  action: 'Approved' | 'Rejected';
  reason?: RejectReason;
  comments?: string;
};

type ApplicationRecord = {
  id: string;
  applicantName: string;
  serviceRequested: 'Passport Renewal' | 'Driver\u2019s Licence' | 'Health Card' | 'SIN Update';
  submittedAt: string;
  status: ApplicationStatus;
  thumbnails: DocumentThumbnails;
  reviewLog?: ReviewLog;
};

const REJECT_REASONS: RejectReason[] = ['Document incomplete', 'Mismatch in ID', 'Blurry photo', 'Other'];
const REVIEWER_ID = 'admin.reviewer.001';

const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'APP-10021',
    applicantName: 'Amelia Thompson',
    serviceRequested: 'Passport Renewal',
    submittedAt: '2026-03-06T13:20:00-05:00',
    status: 'Pending',
    thumbnails: {
      passportScan: 'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_120,h_120/v1312461204/sample.jpg',
      selfie: 'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_120,h_120/samples/people/kitchen-bar.jpg',
      proofOfId: 'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_120,h_120/samples/people/boy-snow-hoodie.jpg',
    },
  },
  {
    id: 'APP-10022',
    applicantName: 'Liam Chen',
    serviceRequested: 'Driver\u2019s Licence',
    submittedAt: '2026-03-07T09:04:00-05:00',
    status: 'Pending',
    thumbnails: {
      passportScan: 'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_120,h_120/samples/people/jazz.jpg',
      selfie: 'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_120,h_120/samples/people/smiling-man.jpg',
      proofOfId: 'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_120,h_120/samples/people/bicycle.jpg',
    },
  },
  {
    id: 'APP-10023',
    applicantName: 'Noah Patel',
    serviceRequested: 'Health Card',
    submittedAt: '2026-03-07T11:42:00-05:00',
    status: 'Pending',
    thumbnails: {
      passportScan: 'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_120,h_120/samples/people/boy-snow-hoodie.jpg',
      selfie: 'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_120,h_120/samples/people/kitchen-bar.jpg',
      proofOfId: 'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_120,h_120/samples/people/jazz.jpg',
    },
  },
  {
    id: 'APP-10024',
    applicantName: 'Isla Martin',
    serviceRequested: 'SIN Update',
    submittedAt: '2026-03-07T13:18:00-05:00',
    status: 'Pending',
    thumbnails: {
      passportScan: 'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_120,h_120/samples/people/smiling-man.jpg',
      selfie: 'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_120,h_120/samples/people/bicycle.jpg',
      proofOfId: 'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_120,h_120/v1312461204/sample.jpg',
    },
  },
];

function formatSubmissionDate(value: string): string {
  return new Date(value).toLocaleString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function AdminReviewerPanel() {
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<RejectReason>('Document incomplete');
  const [comment, setComment] = useState('');

  const pendingCount = useMemo(
    () => applications.filter((item) => item.status === 'Pending').length,
    [applications],
  );

  const approveApplication = (id: string) => {
    const timestamp = new Date().toISOString();
    setApplications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Approved',
              reviewLog: {
                reviewerId: REVIEWER_ID,
                timestamp,
                action: 'Approved',
              },
            }
          : item,
      ),
    );
    if (rejectingId === id) setRejectingId(null);
  };

  const openReject = (id: string) => {
    setRejectingId(id);
    setSelectedReason('Document incomplete');
    setComment('');
  };

  const submitRejection = (id: string) => {
    const timestamp = new Date().toISOString();
    setApplications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Rejected',
              reviewLog: {
                reviewerId: REVIEWER_ID,
                timestamp,
                action: 'Rejected',
                reason: selectedReason,
                comments: comment.trim() || undefined,
              },
            }
          : item,
      ),
    );
    setRejectingId(null);
    setComment('');
  };

  return (
    <section className="admin-panel-wrap" aria-label="Admin Reviewer Panel">
      <div className="admin-panel-header">
        <div>
          <p className="admin-panel-kicker">Reviewer Workspace</p>
          <h1>Submitted Applications</h1>
          <p>Review pending applications, inspect uploaded documents, and decide approval outcomes.</p>
        </div>
        <div className="admin-summary-pill">
          <span className="material-symbols-outlined" aria-hidden="true">pending_actions</span>
          <div>
            <strong>{pendingCount}</strong>
            <span>Pending</span>
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Service</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Documents</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => {
              const isPending = application.status === 'Pending';
              const isRejecting = rejectingId === application.id && isPending;

              return (
                <tr key={application.id}>
                  <td>
                    <div className="applicant-cell">
                      <strong>{application.applicantName}</strong>
                      <span>{application.id}</span>
                    </div>
                  </td>
                  <td>{application.serviceRequested}</td>
                  <td>{formatSubmissionDate(application.submittedAt)}</td>
                  <td>
                    <span className={`status-chip status-${application.status.toLowerCase()}`}>
                      {application.status}
                    </span>
                    {application.reviewLog && (
                      <p className="review-log-line">
                        {application.reviewLog.action} by {application.reviewLog.reviewerId}
                        {' \u00b7 '}
                        {formatSubmissionDate(application.reviewLog.timestamp)}
                      </p>
                    )}
                    {application.reviewLog?.reason && (
                      <p className="review-log-line">
                        Reason: {application.reviewLog.reason}
                        {application.reviewLog.comments ? ` \u00b7 ${application.reviewLog.comments}` : ''}
                      </p>
                    )}
                  </td>
                  <td>
                    <div className="thumbnail-row">
                      <img src={application.thumbnails.passportScan} alt="Passport scan" />
                      <img src={application.thumbnails.selfie} alt="Selfie upload" />
                      <img src={application.thumbnails.proofOfId} alt="Proof of ID" />
                    </div>
                  </td>
                  <td>
                    <div className="action-stack">
                      <button
                        className="admin-action admin-action-approve"
                        onClick={() => approveApplication(application.id)}
                        disabled={!isPending}
                      >
                        Approve
                      </button>
                      <button
                        className="admin-action admin-action-reject"
                        onClick={() => openReject(application.id)}
                        disabled={!isPending}
                      >
                        Reject
                      </button>
                    </div>

                    {isRejecting && (
                      <div className="reject-form">
                        <label>
                          Reject reason
                          <select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value as RejectReason)}>
                            {REJECT_REASONS.map((reason) => (
                              <option key={reason} value={reason}>
                                {reason}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Optional comments
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add reviewer notes"
                            rows={3}
                          />
                        </label>
                        <div className="reject-form-actions">
                          <button className="admin-action admin-action-reject" onClick={() => submitRejection(application.id)}>
                            Confirm Reject
                          </button>
                          <button className="admin-action admin-action-cancel" onClick={() => setRejectingId(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
