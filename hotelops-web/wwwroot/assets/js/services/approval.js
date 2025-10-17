
const ApprovalService = {
  evaluate: ({leadHours=48, amount=0}) => {
    const needs = (leadHours < 6) || (amount > 8000);
    return { requiresApproval: needs, reasons: needs? ['Short lead time or budget exceed'] : [] };
  }
};
