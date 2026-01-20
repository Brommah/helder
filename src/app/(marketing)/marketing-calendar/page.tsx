'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar, ArrowRight, Play, Image as ImageIcon, Video,
  Instagram, Twitter, Linkedin, Mail, Megaphone,
  Target, Users, TrendingUp, CheckCircle2, Clock,
  Zap, FileText, Mic, Camera, Sparkles, ChevronDown,
  Building2, Shield, Brain, Heart, Eye, MessageCircle,
  Repeat2, Bookmark, MoreHorizontal, Send, Home
} from 'lucide-react'

// ===========================================
// CAMPAIGN PHASES
// ===========================================
const CAMPAIGN_PHASES = [
  {
    id: 'pre-launch',
    name: 'PRE-LAUNCH',
    subtitle: 'Awareness & Teasing',
    weeks: 'Week 1-4',
    color: 'bg-amber-500',
    goals: ['Build anticipation', 'Collect waitlist signups', 'Establish brand voice'],
    kpis: ['500 waitlist signups', '10K impressions', '5% engagement rate'],
  },
  {
    id: 'launch',
    name: 'LAUNCH',
    subtitle: 'Big Bang Moment',
    weeks: 'Week 5-6',
    color: 'bg-emerald-500',
    goals: ['Maximum visibility', 'Press coverage', 'Pilot signups'],
    kpis: ['10 press mentions', '5 pilot partners', '50K impressions'],
  },
  {
    id: 'momentum',
    name: 'MOMENTUM',
    subtitle: 'Social Proof & Education',
    weeks: 'Week 7-12',
    color: 'bg-[#93b9e6]',
    goals: ['Share pilot success', 'Educate on Wkb', 'Build community'],
    kpis: ['3 case studies', '1K followers', '20 demo requests'],
  },
  {
    id: 'scale',
    name: 'SCALE',
    subtitle: 'Growth & Conversion',
    weeks: 'Week 13+',
    color: 'bg-slate-900',
    goals: ['Convert leads', 'Expand pilots', 'Referral program'],
    kpis: ['50 paying customers', '€50K ARR', '30% referral rate'],
  },
]

// ===========================================
// CONTENT CALENDAR
// ===========================================
const CONTENT_CALENDAR = [
  // PRE-LAUNCH
  {
    week: 1,
    phase: 'pre-launch',
    posts: [
      {
        day: 'Mon',
        platform: 'linkedin',
        type: 'text',
        hook: 'De beste bouwprojecten zijn de meest transparante.',
        content: `In 68 jaar en 19.000+ projecten hebben we één ding geleerd:\n\nDe beste projecten zijn de meest transparante.\n\nDe slechtste? Die waar documenten verdwijnen, foto's kwijtraken, en garanties in een la belanden.\n\nWe bouwen iets nieuws.\n\nIets dat het bouwen helder maakt.\n\nBinnenkort meer.`,
        cta: 'Volg voor updates',
        imagePrompt: 'Minimalist brutalist photo of construction site with dramatic shadows, black and white, stark contrast, single beam of light illuminating building materials, dust particles visible',
      },
      {
        day: 'Wed',
        platform: 'instagram',
        type: 'carousel',
        hook: '68 jaar. 19.000 projecten. Eén les.',
        content: 'Slide 1: "68 JAAR"\nSlide 2: "19.000 PROJECTEN"\nSlide 3: "3 GENERATIES"\nSlide 4: "ÉÉN LES:"\nSlide 5: "TRANSPARANTIE WINT."',
        cta: 'Link in bio',
        imagePrompt: 'Series of 5 brutalist typography slides with industrial concrete texture background, stark black text on off-white, each number filling entire frame, construction dust overlay effect',
      },
      {
        day: 'Fri',
        platform: 'twitter',
        type: 'thread',
        hook: 'Mijn opa begon in 1956 met bouwen.',
        content: '1/ Mijn opa begon in 1956 met bouwen.\n\n2/ Drie generaties later vraag ik me af: waarom is bouwtransparantie nog steeds zo moeilijk?\n\n3/ Documenten in mappen. Foto's in WhatsApp. Garanties ergens in een la.\n\n4/ We bouwen iets dat dit oplost.\n\n5/ Binnenkort live. Join the waitlist.',
        cta: 'helder.nl/waitlist',
        imagePrompt: null,
      },
    ],
  },
  {
    week: 2,
    phase: 'pre-launch',
    posts: [
      {
        day: 'Tue',
        platform: 'linkedin',
        type: 'video',
        hook: '70% van bouwers worstelt met Wkb-documentatie.',
        content: `De Wkb is nu actief.\n\nEn 70% van de bouwers worstelt met de documentatie-eisen.\n\n→ Consumentendossier verplicht\n→ 20 jaar bewaartermijn\n→ Alle materialen traceerbaar\n\nDit is geen optie meer. Het is wet.\n\nWij bouwen de oplossing.\n\nWaitlist open: helder.nl`,
        cta: 'Join de waitlist',
        imagePrompt: null,
        videoPrompt: 'Documentary style B-roll: construction site office, papers everywhere, frustrated builder looking through filing cabinets, close-up of stressed hands shuffling documents, transition to clean digital interface mockup',
      },
      {
        day: 'Thu',
        platform: 'instagram',
        type: 'reel',
        hook: 'Weet jij wat er in je muren zit?',
        content: 'Hook visual: zooming into wall\n\nNarration: "Weet jij wat er in je muren zit? Welke isolatie? Welke leidingen? Welke garanties?"\n\nProblem: "De meeste huiseigenaren hebben geen idee."\n\nSolution tease: "Wij veranderen dat."\n\nCTA: "Link in bio"',
        cta: 'Link in bio',
        imagePrompt: null,
        videoPrompt: 'Start tight on white wall, camera pulls back revealing entire room, then X-ray style effect showing pipes, wires, insulation layers hidden inside. Transition to phone mockup showing digital documentation. Brutalist text overlays.',
      },
      {
        day: 'Sat',
        platform: 'twitter',
        type: 'poll',
        hook: 'Vraag aan bouwers:',
        content: 'Hoeveel uur per project besteed je aan documentatie?\n\n🔲 < 5 uur\n🔲 5-10 uur\n🔲 10-20 uur\n🔲 > 20 uur\n\nWij denken dat we dit kunnen halveren.',
        cta: 'Stem en volg',
        imagePrompt: null,
      },
    ],
  },
  {
    week: 3,
    phase: 'pre-launch',
    posts: [
      {
        day: 'Mon',
        platform: 'linkedin',
        type: 'carousel',
        hook: 'Van bouwplaats naar cloud.',
        content: `Slide 1: "VAN BOUWPLAATS"\nSlide 2: "NAAR CLOUD"\nSlide 3: "Elke foto. Elk document. Elke garantie."\nSlide 4: "Één plek. 20 jaar bewaard."\nSlide 5: "Upload via WhatsApp. Klaar."\nSlide 6: "Coming soon: WONINGPASPOORT"`,
        cta: 'Waitlist open',
        imagePrompt: 'Brutalist carousel: Slide 1 gritty construction site, Slide 2 clean server room aesthetic, Slide 3-5 minimalist icons on concrete texture, Slide 6 bold product name reveal with construction tape motif',
      },
      {
        day: 'Wed',
        platform: 'instagram',
        type: 'story',
        hook: 'Behind the scenes',
        content: 'Story 1: "Building something big"\nStory 2: Screen recording of product\nStory 3: Team at work\nStory 4: "Want early access?"\nStory 5: Poll - "Interested? Yes/Tell me more"',
        cta: 'Swipe up',
        imagePrompt: 'Raw, unfiltered office shots: laptops with code, whiteboards with wireframes, coffee cups, late night lighting. Brutalist aesthetic - no filters, real moments.',
      },
      {
        day: 'Fri',
        platform: 'twitter',
        type: 'text',
        hook: 'Het probleem met bouwen:',
        content: 'Het probleem met bouwen:\n\n❌ Foto's in 47 verschillende WhatsApp groepen\n❌ Documenten in 12 mappen op 4 drives\n❌ Garanties ergens in een la\n❌ "Vraag maar aan de vorige eigenaar"\n\nDit fixen we.\n\n2 weken.',
        cta: 'Countdown: helder.nl',
        imagePrompt: null,
      },
    ],
  },
  {
    week: 4,
    phase: 'pre-launch',
    posts: [
      {
        day: 'Mon',
        platform: 'all',
        type: 'teaser',
        hook: '1 WEEK.',
        content: '1 WEEK.\n\nWoningpaspoort lanceert.\n\nBouw. Helder.\n\nhelder.nl',
        cta: 'Final countdown',
        imagePrompt: 'Single stark image: concrete wall with "1 WEEK" spray painted in construction orange, dramatic lighting from single source, dust particles, raw industrial aesthetic',
      },
      {
        day: 'Thu',
        platform: 'linkedin',
        type: 'personal',
        hook: 'Waarom ik dit bouw.',
        content: `Waarom ik dit bouw.\n\n(Een persoonlijk verhaal)\n\nMijn opa begon ons bouwbedrijf in 1956. Eén man met een gereedschapskist.\n\nMijn vader nam het over. Groeide naar 50 man.\n\nIk ben de derde generatie. En ik bouw geen huizen.\n\nIk bouw software.\n\nWaarom?\n\nOmdat ik 68 jaar aan bouwkennis heb gezien verdwijnen in dozen, mappen en kapotte harde schijven.\n\nOmdat kopers hun eigen huis niet kennen.\n\nOmdat de Wkb nu transparantie eist, en niemand weet hoe.\n\nDus combineer ik drie generaties bouwervaring met technologie.\n\nHet resultaat: Woningpaspoort.\n\nLanceert volgende week.\n\nLink in comments.`,
        cta: 'Persoonlijk verhaal',
        imagePrompt: 'Split image: old black and white photo of construction workers from 1950s on left, modern laptop with code on right. Same composition, different eras. Brutalist frame.',
      },
    ],
  },
  // LAUNCH WEEK
  {
    week: 5,
    phase: 'launch',
    posts: [
      {
        day: 'Mon',
        platform: 'all',
        type: 'announcement',
        hook: 'WONINGPASPOORT IS LIVE.',
        content: `WONINGPASPOORT IS LIVE.\n\n68 jaar bouwervaring.\n19.000+ projecten.\nNu digitaal.\n\n→ Upload via WhatsApp\n→ Automatische organisatie\n→ 20 jaar bewaard\n→ Wkb-compliant\n\nBouw. Helder.\n\nhelder.nl`,
        cta: 'Start nu',
        imagePrompt: 'Hero launch image: dramatic reveal shot - construction crane lifting digital screen showing Woningpaspoort interface, photorealistic, golden hour lighting, brutalist typography overlay "LIVE"',
        videoPrompt: '15-second launch video: black screen, sound of construction hammer, text appears "68 JAAR", hammer sound, "19.000 PROJECTEN", hammer sound, "NU DIGITAAL", final reveal of product with triumphant industrial sound design',
      },
      {
        day: 'Tue',
        platform: 'linkedin',
        type: 'demo',
        hook: 'Zo werkt het.',
        content: `Zo werkt het Woningpaspoort:\n\n1️⃣ Bouwer stuurt foto via WhatsApp\n2️⃣ AI categoriseert automatisch\n3️⃣ Document verschijnt in timeline\n4️⃣ Koper ziet alles, altijd\n\nGeen nieuwe software.\nGeen training.\nGewoon WhatsApp.\n\nDemo in comments 👇`,
        cta: 'Bekijk demo',
        imagePrompt: null,
        videoPrompt: 'Screen recording style: phone sending WhatsApp message with construction photo, split screen showing web dashboard updating in real-time, satisfying UI animations, brutalist text labels',
      },
      {
        day: 'Wed',
        platform: 'instagram',
        type: 'carousel',
        hook: 'Wat zit er in JOUW muren?',
        content: 'Slide 1: "WAT ZIT ER IN JOUW MUREN?"\nSlide 2: Before - question marks everywhere\nSlide 3: After - clear documentation\nSlide 4: "Elke leiding. Elk materiaal. Elke garantie."\nSlide 5: "Woningpaspoort. Nu live."\nSlide 6: CTA',
        cta: 'Link in bio',
        imagePrompt: 'Carousel set: Slide 1 bold question on concrete, Slide 2 X-ray house with "?" marks, Slide 3 same house with labeled components, Slide 4-5 product features brutalist style, Slide 6 QR code on construction paper texture',
      },
      {
        day: 'Thu',
        platform: 'twitter',
        type: 'thread',
        hook: 'We just launched.',
        content: '1/ We just launched Woningpaspoort. Here\'s the full story 🧵\n\n2/ Started: 1956. My grandfather, one toolbox, big dreams.\n\n3/ Today: 19,000+ homes built. Three generations.\n\n4/ The problem we kept seeing: documentation chaos.\n\n5/ Photos lost. Warranties missing. Buyers clueless.\n\n6/ Solution: Every document, photo, warranty. One place. 20 years.\n\n7/ Upload via WhatsApp. That\'s it.\n\n8/ Try it: helder.nl',
        cta: 'Read full thread',
        imagePrompt: null,
      },
      {
        day: 'Fri',
        platform: 'linkedin',
        type: 'pilot',
        hook: 'BOUWERS VAN MORGEN',
        content: `🚀 BOUWERS VAN MORGEN\n\nWe zoeken 5 vooruitstrevende bouwers.\n\nWat je krijgt:\n→ Gratis toegang (12 weken)\n→ Persoonlijke onboarding\n→ Directe lijn naar ons team\n→ Invloed op roadmap\n\nWat wij vragen:\n→ 1 actief project\n→ 6x 30 min feedback\n→ Eerlijke mening\n\nWaarde: €3.200+. Kosten: €0.\n\nLink in comments.`,
        cta: 'Word pilot partner',
        imagePrompt: 'Bold call-out image: "BOUWERS VAN MORGEN" in construction stencil font, hard hat silhouette, limited spots counter "5 PLEKKEN", industrial concrete background',
      },
    ],
  },
  // MOMENTUM PHASE
  {
    week: 7,
    phase: 'momentum',
    posts: [
      {
        day: 'Mon',
        platform: 'linkedin',
        type: 'testimonial',
        hook: '"Eindelijk weet ik wat ik aflever."',
        content: `"Eindelijk weet ik wat ik aflever."\n\n— [Pilot Bouwer], [Bedrijf]\n\nNa 3 weken Woningpaspoort:\n→ 47 documenten geüpload\n→ 234 foto's automatisch gesorteerd\n→ 8 uur bespaard op administratie\n→ 1 tevreden klant met compleet dossier\n\nDit is wat Wkb-compliance kan zijn.\n\nGeïnteresseerd? Link in comments.`,
        cta: 'Lees volledige case',
        imagePrompt: 'Testimonial card: photo of builder with arms crossed confidently, construction site background, pull quote in brutalist typography, stats displayed as bold numbers',
      },
      {
        day: 'Wed',
        platform: 'instagram',
        type: 'educational',
        hook: 'WKB UITGELEGD IN 60 SECONDEN',
        content: 'Reel script:\n\n"Wkb. Wet kwaliteitsborging. Wat betekent het voor jou?"\n\n"Als bouwer: compleet dossier verplicht."\n"Als koper: recht op alle documenten."\n"De deadline: bij oplevering."\n"De straf: aansprakelijkheid."\n\n"Hoe los je dit op? Simpel. Automatisch. Woningpaspoort."',
        cta: 'Meer over Wkb',
        imagePrompt: null,
        videoPrompt: 'Fast-paced educational reel: split screen with law book on one side, construction on other. Text animations explaining each Wkb requirement. Transitions with construction sounds. End with product solution.',
      },
      {
        day: 'Fri',
        platform: 'twitter',
        type: 'stat',
        hook: 'Week 2 stats:',
        content: 'Week 2 stats:\n\n📄 847 documents uploaded\n📸 2,341 photos organized\n⏱️ ~40 hours saved\n🏠 12 projects active\n\nThis is what happens when you make documentation easy.\n\nThanks to our pilot builders. You\'re building the future.',
        cta: 'Join the pilots',
        imagePrompt: null,
      },
    ],
  },
]

// ===========================================
// MOCK SOCIAL POSTS COMPONENTS
// ===========================================
function InstagramPost({ post }: { post: typeof CONTENT_CALENDAR[0]['posts'][0] }) {
  return (
    <div className="bg-white border border-slate-200 max-w-[400px]">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-slate-100">
        <div className="w-8 h-8 bg-slate-900 flex items-center justify-center">
          <span className="text-white text-xs font-black">H</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">helder.nl</p>
          <p className="text-xs text-slate-400">Sponsored</p>
        </div>
        <MoreHorizontal className="w-5 h-5 text-slate-400" />
      </div>
      
      {/* Image */}
      <div className="aspect-square bg-slate-900 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-2xl lg:text-3xl font-black text-white leading-tight mb-4">
            {post.hook}
          </p>
          {post.imagePrompt && (
            <p className="text-xs text-white/30 font-mono">[{post.type.toUpperCase()}]</p>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 text-slate-900" />
            <MessageCircle className="w-6 h-6 text-slate-900" />
            <Send className="w-6 h-6 text-slate-900" />
          </div>
          <Bookmark className="w-6 h-6 text-slate-900" />
        </div>
        <p className="text-sm font-bold text-slate-900 mb-1">2,847 likes</p>
        <p className="text-sm text-slate-700">
          <span className="font-bold">helder.nl</span>{' '}
          {post.content.split('\n')[0]}...
        </p>
        <p className="text-xs text-slate-400 mt-2 uppercase">2 hours ago</p>
      </div>
    </div>
  )
}

function TwitterPost({ post }: { post: typeof CONTENT_CALENDAR[0]['posts'][0] }) {
  return (
    <div className="bg-white border border-slate-200 p-4 max-w-[500px]">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-slate-900 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-black">H</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Helder</span>
            <span className="text-slate-400">@helder_nl</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400">2h</span>
          </div>
          
          {/* Content */}
          <div className="mt-2 text-slate-900 whitespace-pre-line text-[15px]">
            {post.content}
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between mt-4 text-slate-400">
            <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">47</span>
            </div>
            <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer">
              <Repeat2 className="w-4 h-4" />
              <span className="text-sm">128</span>
            </div>
            <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer">
              <Heart className="w-4 h-4" />
              <span className="text-sm">892</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
              <Eye className="w-4 h-4" />
              <span className="text-sm">12.4K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LinkedInPost({ post }: { post: typeof CONTENT_CALENDAR[0]['posts'][0] }) {
  return (
    <div className="bg-white border border-slate-200 max-w-[550px]">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-slate-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black">H</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900">Martijn Broersma</p>
            <p className="text-xs text-slate-500">Founder @ Helder | 3rd gen builder turned tech</p>
            <p className="text-xs text-slate-400">2h • 🌐</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="mt-4 text-slate-900 whitespace-pre-line text-sm leading-relaxed">
          {post.content.length > 300 ? post.content.substring(0, 300) + '...' : post.content}
        </div>
        
        {post.content.length > 300 && (
          <button className="text-slate-500 text-sm font-medium mt-2">...meer weergeven</button>
        )}
      </div>
      
      {/* Image */}
      {post.imagePrompt && (
        <div className="aspect-video bg-slate-800 flex items-center justify-center">
          <div className="text-center p-8">
            <ImageIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-sm text-white/50 font-mono max-w-md">
              {post.imagePrompt.substring(0, 100)}...
            </p>
          </div>
        </div>
      )}
      
      {/* Engagement */}
      <div className="px-4 py-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>👍 💡 ❤️</span>
          <span>1,247</span>
          <span className="ml-auto">89 comments · 34 reposts</span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="grid grid-cols-4 border-t border-slate-100">
        {['Like', 'Comment', 'Repost', 'Send'].map((action) => (
          <button 
            key={action}
            className="py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  )
}

// ===========================================
// IMAGE PROMPT CARD
// ===========================================
function ImagePromptCard({ prompt, type }: { prompt: string; type: 'image' | 'video' }) {
  return (
    <div className="bg-slate-900 p-6">
      <div className="flex items-center gap-3 mb-4">
        {type === 'image' ? (
          <Camera className="w-5 h-5 text-[#93b9e6]" />
        ) : (
          <Video className="w-5 h-5 text-[#93b9e6]" />
        )}
        <span className="text-xs font-black text-white/50 uppercase tracking-wider">
          {type === 'image' ? 'Image Prompt' : 'Video Prompt'}
        </span>
      </div>
      <p className="text-white/80 text-sm font-mono leading-relaxed">{prompt}</p>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-white/30">
          Use with: Midjourney, DALL-E, or Sora for video
        </p>
      </div>
    </div>
  )
}

// ===========================================
// MAIN PAGE
// ===========================================
export default function MarketingCalendarPage() {
  const [activePhase, setActivePhase] = useState('pre-launch')
  const [selectedWeek, setSelectedWeek] = useState(1)

  const currentWeekContent = CONTENT_CALENDAR.find(w => w.week === selectedWeek)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 flex items-center justify-center">
                <span className="text-white font-black text-lg">H</span>
              </div>
              <span className="font-black text-slate-900 tracking-tight">HELDER</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Marketing Calendar
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-[#93b9e6]" />
            <span className="text-[#93b9e6] text-xs font-black uppercase tracking-[0.3em]">
              Go-To-Market Strategy
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-6">
            LAUNCH<br />
            <span className="text-[#93b9e6]">CALENDAR.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl">
            12-week marketing execution plan with ready-to-use assets, 
            content prompts, and mock social posts.
          </p>
        </div>
      </section>

      {/* Campaign Phases */}
      <section className="py-12 px-6 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-slate-200">
            {CAMPAIGN_PHASES.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`p-6 text-left transition-all ${
                  activePhase === phase.id 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`w-3 h-3 ${phase.color} mb-4`} />
                <h3 className="font-black text-lg mb-1">{phase.name}</h3>
                <p className={`text-sm mb-2 ${activePhase === phase.id ? 'text-white/60' : 'text-slate-400'}`}>
                  {phase.subtitle}
                </p>
                <p className={`text-xs font-bold uppercase tracking-wider ${
                  activePhase === phase.id ? 'text-[#93b9e6]' : 'text-slate-300'
                }`}>
                  {phase.weeks}
                </p>
              </button>
            ))}
          </div>
          
          {/* Phase Details */}
          {CAMPAIGN_PHASES.filter(p => p.id === activePhase).map((phase) => (
            <div key={phase.id} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-wider mb-4">Goals</h4>
                <ul className="space-y-2">
                  {phase.goals.map((goal, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#93b9e6]" />
                      <span className="text-slate-600">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-wider mb-4">KPIs</h4>
                <ul className="space-y-2">
                  {phase.kpis.map((kpi, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600">{kpi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Week Selector */}
      <section className="py-8 px-6 bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {CONTENT_CALENDAR.map((week) => (
              <button
                key={week.week}
                onClick={() => setSelectedWeek(week.week)}
                className={`px-4 py-2 font-black text-sm uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedWeek === week.week
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-400 hover:text-slate-900'
                }`}
              >
                Week {week.week}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Calendar */}
      {currentWeekContent && (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Calendar className="w-6 h-6 text-[#93b9e6]" />
              <h2 className="text-2xl font-black text-slate-900">
                WEEK {currentWeekContent.week} CONTENT
              </h2>
              <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider ${
                currentWeekContent.phase === 'pre-launch' ? 'bg-amber-500 text-white' :
                currentWeekContent.phase === 'launch' ? 'bg-emerald-500 text-white' :
                'bg-[#93b9e6] text-slate-900'
              }`}>
                {currentWeekContent.phase}
              </span>
            </div>

            <div className="space-y-16">
              {currentWeekContent.posts.map((post, idx) => (
                <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Post Details */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-sm font-black text-slate-400 uppercase">{post.day}</span>
                      <div className={`px-3 py-1 text-xs font-black uppercase tracking-wider ${
                        post.platform === 'linkedin' ? 'bg-blue-600 text-white' :
                        post.platform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                        post.platform === 'twitter' ? 'bg-slate-900 text-white' :
                        'bg-slate-200 text-slate-900'
                      }`}>
                        {post.platform}
                      </div>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        {post.type}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 mb-4">
                      "{post.hook}"
                    </h3>
                    
                    <div className="bg-white border border-slate-200 p-6 mb-6">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Copy
                      </p>
                      <p className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">
                        {post.content}
                      </p>
                      {post.cta && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <span className="text-xs font-black text-[#93b9e6] uppercase tracking-wider">
                            CTA: {post.cta}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Image/Video Prompts */}
                    {post.imagePrompt && (
                      <ImagePromptCard prompt={post.imagePrompt} type="image" />
                    )}
                    {post.videoPrompt && (
                      <div className="mt-4">
                        <ImagePromptCard prompt={post.videoPrompt} type="video" />
                      </div>
                    )}
                  </div>

                  {/* Mock Post Preview */}
                  <div className="flex justify-center items-start">
                    {post.platform === 'instagram' && <InstagramPost post={post} />}
                    {post.platform === 'twitter' && <TwitterPost post={post} />}
                    {post.platform === 'linkedin' && <LinkedInPost post={post} />}
                    {post.platform === 'all' && (
                      <div className="space-y-6">
                        <InstagramPost post={post} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Asset Checklist */}
      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 bg-[#93b9e6]" />
            <span className="text-[#93b9e6] text-xs font-black uppercase tracking-[0.3em]">
              Production Checklist
            </span>
          </div>
          <h2 className="text-4xl font-black text-white mb-12">
            ASSETS TO CREATE
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {[
              {
                category: 'Photography',
                items: [
                  'Hero construction site shoot',
                  'Team/founder portraits',
                  'Product screenshots (20+)',
                  'Before/after documentation',
                  'Pilot builder testimonials',
                ],
              },
              {
                category: 'Video',
                items: [
                  'Launch announcement (15s)',
                  'Product demo (60s)',
                  'Founder story (2min)',
                  'Wkb explainer reel (30s)',
                  'Testimonial interviews',
                ],
              },
              {
                category: 'Graphics',
                items: [
                  'Social templates (IG, LI, X)',
                  'Carousel templates',
                  'Stats/infographics',
                  'Email headers',
                  'Press kit assets',
                ],
              },
            ].map((section) => (
              <div key={section.category} className="bg-slate-800 p-8">
                <h3 className="font-black text-white uppercase tracking-wider mb-6">
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-4 h-4 border border-white/30" />
                      <span className="text-white/70 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Execution Timeline */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 mb-12">
            EXECUTION TIMELINE
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200" />
            
            <div className="space-y-8">
              {[
                { week: 'Week -2', title: 'Asset Production', tasks: ['Shoot photography', 'Record videos', 'Design templates', 'Write all copy'] },
                { week: 'Week -1', title: 'Setup & Testing', tasks: ['Schedule all posts', 'Test automations', 'Prep press outreach', 'Final review'] },
                { week: 'Week 1-4', title: 'Pre-Launch', tasks: ['Daily posting begins', 'Waitlist collection', 'Build anticipation', 'Engage with comments'] },
                { week: 'Week 5-6', title: 'Launch', tasks: ['Big announcement', 'Press releases go live', 'Pilot recruitment', 'Webinar execution'] },
                { week: 'Week 7-12', title: 'Momentum', tasks: ['Share pilot success', 'Educational content', 'Case studies', 'Community building'] },
              ].map((phase, i) => (
                <div key={i} className="relative flex gap-8">
                  <div className="relative z-10 w-16 h-16 bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-xs">{phase.week.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 p-6">
                    <h3 className="font-black text-slate-900 mb-1">{phase.week}</h3>
                    <p className="text-[#93b9e6] font-bold mb-4">{phase.title}</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {phase.tasks.map((task, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-slate-500">
                          <CheckCircle2 className="w-4 h-4 text-slate-300" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 bg-[#93b9e6]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            READY TO LAUNCH?
          </h2>
          <p className="text-xl text-slate-900/60 mb-8">
            This calendar is your execution playbook. Every post, every prompt, every asset.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-white hover:text-slate-900 transition-colors"
            >
              Back to Home
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
