// Customer reviews keyed by product id. A subset of products carry reviews;
// the product detail page falls back to a sensible "no reviews" state otherwise.

export const reviewsByProduct = {
  'cnc-lathe-sl500': [
    {
      id: 'r1',
      name: 'Mahesh Iyer',
      role: 'Shop Floor Manager',
      rating: 5,
      date: '12 Sep 2025',
      text: 'Excellent finish and repeatability. We have run 20,000 parts on the SL 500 with no spindle issues. Support from Shakti Engineering was responsive during installation.',
    },
    {
      id: 'r2',
      name: 'Farhan Ali',
      role: 'Proprietor',
      rating: 4,
      date: '28 Aug 2025',
      text: 'Good value for a Fanuc-controlled lathe. Tool setting could be more intuitive, but once dialled in the accuracy is consistent within 0.01 mm.',
    },
    {
      id: 'r3',
      name: 'Sunita Rao',
      role: 'Production Planner',
      rating: 5,
      date: '04 Jul 2025',
      text: 'Rigid box ways make a real difference on heavy cuts. Cycle time dropped noticeably versus our older machine.',
    },
  ],
  'cordless-impact-drill-20v': [
    {
      id: 'r4',
      name: 'Gurpreet Singh',
      role: 'Site Supervisor',
      rating: 5,
      date: '02 Oct 2025',
      text: 'Battery lasts a full day of mixed drilling on a single pack. The 45 Nm torque handles M8 into steel without stalling.',
    },
    {
      id: 'r5',
      name: 'Lakshmi V',
      role: 'Maintenance Lead',
      rating: 4,
      date: '18 Sep 2025',
      text: 'Comfortable grip and the LED is handy. Chuck loosens occasionally under heavy side load, otherwise great.',
    },
  ],
  'tmt-bar-fe500d-12': [
    {
      id: 'r6',
      name: 'Ramesh Constructions',
      role: 'Civil Contractor',
      rating: 5,
      date: '22 Sep 2025',
      text: 'Consistent diameter and bendability. Test certificates were provided for every lot. Best pricing we found for Fe 500D.',
    },
    {
      id: 'r7',
      name: 'Kavya Builders',
      role: 'Procurement',
      rating: 4,
      date: '05 Aug 2025',
      text: 'Quality is good and delivery was on time. Would appreciate clearer weight reconciliation on the delivery slip.',
    },
  ],
  'submersible-pump-1-5hp': [
    {
      id: 'r8',
      name: 'Deva Reddy',
      role: 'Farmer',
      rating: 5,
      date: '30 Sep 2025',
      text: 'Running at 120 feet with strong discharge for the last eight months. No overheating even in summer. Very satisfied.',
    },
    {
      id: 'r9',
      name: 'Suresh Patil',
      role: 'Plumbing Contractor',
      rating: 4,
      date: '11 Aug 2025',
      text: 'Good pump for the price. Installation guide could be more detailed for first-time buyers.',
    },
  ],
  'safety-helmet-isi': [
    {
      id: 'r10',
      name: 'Nikhil Joshi',
      role: 'HSE Officer',
      rating: 5,
      date: '15 Oct 2025',
      text: 'Comfortable harness and the ratchet adjustment holds well through a full shift. ISI mark paperwork was in order.',
    },
    {
      id: 'r11',
      name: 'Asha K',
      role: 'Store In-charge',
      rating: 4,
      date: '02 Sep 2025',
      text: 'Durable and the colour has not faded in sun. Sizing runs slightly large, fine for most workers.',
    },
  ],
  'transformer-100kva': [
    {
      id: 'r12',
      name: 'PowerGrid Infra',
      role: 'Electrical Engineer',
      rating: 5,
      date: '08 Oct 2025',
      text: 'Losses are within IS 1180 High Efficiency band. Routine test report was thorough and the unit commissioned without issues.',
    },
  ],
  'ss-pipe-304-2inch': [
    {
      id: 'r13',
      name: 'BioPharma Solutions',
      role: 'Project Engineer',
      rating: 5,
      date: '21 Sep 2025',
      text: 'Clean interior finish, no pits. Mill test certificate with 304 chemistry was provided. Perfect for our pharma lines.',
    },
    {
      id: 'r14',
      name: 'FoodTech Industries',
      role: 'Maintenance',
      rating: 4,
      date: '14 Aug 2025',
      text: 'Good quality seamless pipe. Ends were cleanly cut and bundled.',
    },
  ],
}

export const getReviewsForProduct = (productId) => reviewsByProduct[productId] || []
