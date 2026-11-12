"""Fixed vocabularies used by the cleaning pipeline.

Everything here is plain data so teammates can review and extend it without
touching the pipeline logic. Keep the keyword lists lowercase.
"""

CATEGORIES = [
    "Education & Learning",
    "Agriculture & Farming",
    "Women & Child Development",
    "Business & Entrepreneurship",
    "Health & Wellness",
    "Social Welfare & Empowerment",
    "Disability & Rehabilitation",
    "Senior Citizens",
    "Employment & Skills",
    "Housing & Shelter",
]

# Keyword rules for categories, checked against the normalised scheme name.
# Order = priority: when several categories match, the first one becomes the
# primary category; every match is kept in `categories` (multi-label).
# Patterns are regexes matched with word boundaries on the left.
CATEGORY_RULES: list[tuple[str, list[str]]] = [
    ("Education & Learning", [
        r"scholarship", r"chhatravriti", r"chatravriti", r"fellowship", r"studentship",
        r"students?\b", r"education", r"school", r"college", r"universit", r"coaching",
        r"b\.ed", r"higher stud", r"internship", r"tuition", r"aicte", r"ugc\b",
        r"merit award", r"post[- ]?matric", r"pre[- ]?matric", r"medhavi",
    ]),
    ("Disability & Rehabilitation", [
        r"disab", r"differently[- ]abled", r"divyang", r"handicap", r"visually impaired",
        r"intellectually", r"prosthe", r"artificial limb", r"assistive", r"blind",
        r"deaf", r"udid", r"tricycle", r"early intervention",
    ]),
    ("Senior Citizens", [
        r"old age", r"senior citizen", r"vriddh", r"elderly", r"veteran", r"baristha",
        r"aged person",
    ]),
    ("Women & Child Development", [
        r"widow", r"girls?\b", r"daughters?", r"women", r"woman", r"mahila", r"nari",
        r"maternity", r"pregnan", r"kanya", r"beti", r"ladli", r"behna", r"dependent children",
        r"acid attack", r"orphan girl", r"vivah",
    ]),
    ("Health & Wellness", [
        r"health", r"medical", r"treatment", r"hospital", r"disease", r"cancer",
        r"\btb\b", r"hiv", r"aids\b", r"aarogya", r"arogya", r"diagnos", r"newborn",
        r"bal sakha",
    ]),
    ("Housing & Shelter", [
        r"housing", r"\bhouse", r"awas", r"aaws", r"dwelling", r"bedroom", r"shelter", r"ghar\b", r"pucca",
    ]),
    ("Agriculture & Farming", [
        r"agricultur", r"krishi", r"farmer", r"farm\b", r"kisan", r"crop", r"fasal",
        r"seed", r"irrigation", r"drip", r"horticultur", r"floricultur", r"fisher",
        r"fishing", r"fish", r"stake net", r"insulated box", r"cattle", r"dairy",
        r"livestock", r"poultry", r"birds unit", r"kadaknath", r"sericultur", r"coffee",
        r"\btea\b", r"organic", r"tractor", r"apeda", r"diggy", r"pump ?set", r"shettale",
        r"mechani[sz]ation", r"agri",
    ]),
    ("Employment & Skills", [
        r"skill", r"training", r"employment", r"job", r"apprentice", r"rozgar",
        r"unemploy", r"toolkit", r"silai", r"sewing", r"recruitment", r"placement",
    ]),
    ("Business & Entrepreneurship", [
        r"entrepreneur", r"start-?up", r"msme", r"enterprise", r"industr", r"capital investment",
        r"interest subvention", r"interest subsidy", r"credit", r"loan", r"venture",
        r"ignition grant", r"production linked", r"\bpli\b", r"rikshaw", r"rickshaw",
        r"thela", r"micro ?finance", r"export",
    ]),
    ("Social Welfare & Empowerment", [
        r"funeral", r"death", r"accident", r"pension", r"marriage", r"inter[- ]caste",
        r"cash gift", r"welfare board", r"bocw", r"shramik", r"karmakar", r"karmakaar",
        r"annath", r"anath", r"orphan",
    ]),
]

# Canonical document types. Each entry: (canonical name, regex patterns).
# A raw document string is mapped to the first type whose pattern matches.
DOCUMENT_TYPES: list[tuple[str, list[str]]] = [
    ("Aadhaar Card", [r"aadha?a?r"]),
    ("Bank Passbook / Account Details", [r"passbook", r"bank account", r"bank details", r"cancell?ed cheque"]),
    ("Income Certificate", [r"income certificate", r"income proof", r"proof of income", r"salary slip"]),
    ("Caste Certificate", [r"caste certificate", r"\bcaste\b", r"tribe certificate", r"community certificate"]),
    ("Domicile / Residence Certificate", [r"domicile", r"residen", r"address proof", r"proof of address"]),
    ("Ration Card / BPL Card", [r"ration card", r"\bbpl\b", r"nfsa", r"antyodaya"]),
    ("Disability Certificate (UDID)", [r"disability certificate", r"udid", r"medical board certificate"]),
    ("Educational Certificate / Marksheet", [r"marksheet", r"mark sheet", r"educational", r"bonafide",
                                             r"admission", r"fee receipt", r"school leaving", r"transfer certificate"]),
    ("Land Records", [r"land record", r"khasra", r"khatauni", r"khatoni", r"\bror\b", r"7/12", r"land ownership"]),
    ("Passport-size Photograph", [r"photo"]),
    ("Birth Certificate / Age Proof", [r"birth certificate", r"proof of age", r"age proof", r"date of birth"]),
    ("Death Certificate", [r"death certificate"]),
    ("Marriage Certificate", [r"marriage certificate", r"wedding card"]),
    ("Voter ID", [r"voter"]),
    ("PAN Card", [r"\bpan\b"]),
    ("Medical Certificate", [r"medical certificate", r"doctor", r"medical officer", r"hospital"]),
    ("Labour / Worker Registration Card", [r"labour card", r"registration card", r"beneficiary card",
                                           r"labour registration", r"worker registration", r"membership"]),
    ("Application Form", [r"application form", r"prescribed form", r"\bform\b", r"annexure"]),
    ("Self Declaration / Affidavit", [r"affidavit", r"self[- ]declaration", r"undertaking"]),
    ("Project Report / Business Plan", [r"project report", r"\bdpr\b", r"business plan", r"quotation", r"estimate"]),
    ("Mobile Number", [r"mobile number"]),
]

# Words that make a leftover string look like a real document name.
DOCUMENT_HINT_WORDS = [
    "certificate", "card", "proof", "copy", "letter", "report", "statement", "receipt",
    "record", "book", "invoice", "licen", "registration", "id", "document", "passbook",
    "photograph", "deed", "order", "bill",
]

INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    # Union territories
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
]

# Domain fragments that unambiguously identify a state portal.
STATE_DOMAIN_HINTS: dict[str, str] = {
    "gujarat": "Gujarat", "delhi": "Delhi", "cglabour": "Chhattisgarh", "cg.gov": "Chhattisgarh",
    "goa.gov": "Goa", "haryana": "Haryana", "hrylabour": "Haryana", "kerala": "Kerala",
    "assam": "Assam", "megbocwwb": "Meghalaya", "meghalaya": "Meghalaya", "chd.gov": "Chandigarh",
    "jharkhand": "Jharkhand", "manipur": "Manipur", "mn.gov": "Manipur", "maharashtra": "Maharashtra",
    "odisha": "Odisha", "py.gov": "Puducherry", "rajasthan": "Rajasthan", "uk.gov": "Uttarakhand",
    "punjab": "Punjab", "tn.gov": "Tamil Nadu", "jk.gov": "Jammu and Kashmir", "mp.gov": "Madhya Pradesh",
    "mpedistrict": "Madhya Pradesh", "aphandtex": "Andhra Pradesh", "sikkim": "Sikkim",
    "bihar": "Bihar", "telangana": "Telangana", "karnataka": "Karnataka", "up.gov": "Uttar Pradesh",
    "wb.gov": "West Bengal", "tripura": "Tripura", "mizoram": "Mizoram", "nagaland": "Nagaland",
    "hp.gov": "Himachal Pradesh", "arunachal": "Arunachal Pradesh",
}

# Name fragments (besides full state names) that identify a state.
STATE_NAME_HINTS: dict[str, str] = {
    "goan": "Goa", "andaman": "Andaman and Nicobar Islands",
    "chief ministergi": "Manipur", "tengbang": "Manipur", "h.p": "Himachal Pradesh",
}

# Generic landing pages that do not point at a specific scheme.
GENERIC_URLS = {"https://www.myscheme.gov.in/", "https://www.myscheme.gov.in", "https://myscheme.gov.in/"}

OCCUPATIONS = ["student", "farmer", "entrepreneur", "unemployed", "artisan", "construction_worker"]
