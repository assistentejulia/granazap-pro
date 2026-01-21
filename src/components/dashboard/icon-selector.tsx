"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

// Lista de ícones disponíveis
const AVAILABLE_ICONS = [
  // Financeiro & Receitas
  'DollarSign', 'TrendingUp', 'Wallet', 'Briefcase', 'Award', 'Gift', 'PiggyBank',
  'CreditCard', 'Banknote', 'Coins', 'HandCoins', 'Landmark', 'CircleDollarSign',
  'Receipt', 'Scale', 'Percent', 'Trophy', 'Gem', 'BadgeCheck', 'BaggageClaim',

  // Alimentação & Lazer
  'Utensils', 'UtensilsCrossed', 'ChefHat', 'Coffee', 'Pizza', 'GlassWater', 'Beer', 'Wine',
  'IceCream', 'Cake', 'Apple', 'Banana', 'Carrot', 'Egg', 'Fish', 'Popcorn',
  'Gamepad2', 'Gamepad', 'Tv', 'Tv2', 'Film', 'Clapperboard', 'Music', 'Music2',
  'Headphones', 'Mic', 'Camera', 'Ticket', 'Ghost', 'Dice5',

  // Moradia & Serviços
  'Home', 'Building', 'Building2', 'Hotel', 'Warehouse', 'Zap', 'Droplet', 'Wifi',
  'Plug', 'Power', 'Trash2', 'Recycle', 'Wrench', 'Hammer', 'Construction',
  'Paintbrush', 'Pencil', 'Lightbulb', 'Key', 'Lock', 'Shield',

  // Transporte & Viagem
  'Car', 'Bus', 'Train', 'Plane', 'Sailboat', 'Ship', 'Bike', 'Fuel',
  'Map', 'MapPin', 'Globe', 'Compass', 'Luggage', 'Mountain', 'Palmtree', 'Tent',

  // Saúde & Bem-estar
  'Heart', 'Stethoscope', 'Activity', 'Syringe', 'Tablets', 'Pill', 'Dna',
  'Dumbbell', 'Footprints', 'Smile', 'Baby', 'Dog', 'Cat', 'PawPrint', 'Sprout', 'Flower2',

  // Educação & Trabalho
  'GraduationCap', 'BookOpen', 'Book', 'Library', 'Laptop', 'Smartphone', 'Tablet',
  'Mouse', 'Keyboard', 'Monitor', 'Printer', 'Mail', 'Inbox', 'Calendar', 'Clock',
  'Users', 'User', 'MessageSquare', 'Briefcase', 'FileText', 'Clipboard',

  // Vestuário & Compras
  'Shirt', 'Footprints', 'ShoppingBag', 'ShoppingCart', 'ShoppingBasket', 'Package', 'Box',
  'Tag', 'Store', 'Watch', 'Glasses', 'Scissors',

  // Diversos & Símbolos
  'Triangle', 'Square', 'Circle', 'Hexagon', 'HeartHandshake', 'Verified'
];

// Deduplicate icons ensuring uniqueness
const UNIQUE_ICONS = Array.from(new Set(AVAILABLE_ICONS));

// Mapeamento de palavras-chave para busca em português
const ICON_KEYWORDS: Record<string, string[]> = {
  // Financeiro
  DollarSign: ['dinheiro', 'dolar', 'pagamento', 'financas', 'receita'],
  TrendingUp: ['investimento', 'grafico', 'lucro', 'alta', 'rendimento'],
  Wallet: ['carteira', 'saldo', 'dinheiro'],
  Briefcase: ['trabalho', 'emprego', 'job', 'negocios', 'pasta', 'escritorio'],
  Award: ['premio', 'recompensa', 'conquista', 'bonus'],
  Gift: ['presente', 'doacao', 'aniversario'],
  PiggyBank: ['cofrinho', 'poupanca', 'economia', 'guardar'],
  CreditCard: ['cartao', 'credito', 'debito', 'compra'],
  Banknote: ['dinheiro', 'nota', 'cedula', 'papel'],
  Landmark: ['banco', 'predio', 'instituicao', 'financiamento'],
  Receipt: ['recibo', 'cupom', 'nota fiscal', 'fatura', 'boleto'],

  // Alimentação
  Utensils: ['restaurante', 'comida', 'almoco', 'jantar', 'talheres', 'prato'],
  ChefHat: ['cozinha', 'cozinhar', 'chef', 'preparo'],
  Coffee: ['cafe', 'lanche', 'padaria', 'matinal'],
  Pizza: ['pizza', 'pizzaria', 'delivery', 'ifood'],
  Beer: ['cerveja', 'bar', 'happy hour', 'bebida'],
  Wine: ['vinho', 'adega', 'bebida'],
  IceCream: ['sorvete', 'sobremesa', 'doce'],
  Apple: ['fruta', 'saudavel', 'feira', 'mercado'],
  ShoppingCart: ['mercado', 'supermercado', 'compras', 'carrinho'],

  // Lazer
  Gamepad2: ['jogos', 'games', 'videogame', 'lazer'],
  Tv: ['televisao', 'filme', 'serie', 'streaming', 'netflix'],
  Film: ['cinema', 'filme', 'pipoca'],
  Music: ['musica', 'show', 'concerto', 'spotify'],
  Ticket: ['ingresso', 'cinema', 'evento', 'ticket'],
  Plane: ['aviao', 'viagem', 'passagem', 'ferias', 'turismo'],

  // Casa & Serviços
  Home: ['casa', 'moradia', 'aluguel', 'lar'],
  Building: ['apartamento', 'condominio', 'predio'],
  Zap: ['luz', 'energia', 'eletricidade', 'conta'],
  Droplet: ['agua', 'saneamento', 'conta'],
  Wifi: ['internet', 'conexao', 'rede'],
  Trash2: ['lixo', 'limpeza', 'servico'],
  Wrench: ['manutencao', 'reparo', 'conserto', 'obra'],
  Hammer: ['construcao', 'obra', 'reforma'],

  // Transporte
  Car: ['carro', 'automovel', 'uber', 'taxi', 'veiculo'],
  Bus: ['onibus', 'transporte publico', 'passagem'],
  Fuel: ['combustivel', 'gasolina', 'posto', 'abastecer'],
  Map: ['mapa', 'viagem', 'localizacao'],

  // Saúde
  Heart: ['saude', 'medico', 'hospital', 'vida'],
  Stethoscope: ['medico', 'consulta', 'exame', 'doutor'],
  Pill: ['remedio', 'farmacia', 'medicamento', 'drogaria'],
  Dumbbell: ['academia', 'esporte', 'treino', 'fitness'],

  // Educação
  GraduationCap: ['educacao', 'faculdade', 'escola', 'curso', 'estudo'],
  Book: ['livro', 'leitura', 'estudo', 'biblioteca'],
  Laptop: ['computador', 'tecnologia', 'notebook', 'trabalho'],

  // Vestuário & Pessoal
  Shirt: ['roupa', 'vestuario', 'moda', 'camisa'],
  ShoppingBag: ['compras', 'loja', 'shopping', 'sacola'],
  Tag: ['etiqueta', 'preco', 'promocao', 'categoria'],
  Scissors: ['salao', 'corte', 'cabelo', 'barbearia'],

  // Outros
  User: ['pessoal', 'usuario', 'mim'],
  Star: ['favorito', 'destaque', 'importante'],
  Calendar: ['data', 'prazo', 'agendamento']
};

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
  accentColor: string;
}

export function IconSelector({ selectedIcon, onSelectIcon, accentColor }: IconSelectorProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIcons = UNIQUE_ICONS.filter(icon => {
    const searchLower = searchTerm.toLowerCase();
    // Search by icon name
    if (icon.toLowerCase().includes(searchLower)) return true;

    // Search by keywords (Portuguese)
    const keywords = ICON_KEYWORDS[icon];
    if (keywords && keywords.some(k => k.toLowerCase().includes(searchLower))) return true;

    return false;
  });

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Tag;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {t('categories.modal.icon')} <span className="text-muted-foreground">({t('categories.modal.optional')})</span>
      </label>

      {/* Search */}
      <input
        type="text"
        placeholder={t('categories.modal.searchIcon')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full h-9 px-3 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-border/80 transition-colors"
        style={{ borderColor: '' }}
        onFocus={(e) => e.target.style.borderColor = accentColor}
        onBlur={(e) => e.target.style.borderColor = ''}
      />

      {/* Icon Grid */}
      <div className="grid grid-cols-8 gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-muted/50 dark:bg-[#0A0F1C] rounded-lg border border-border dark:border-white/10 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {filteredIcons.map((iconName) => {
          const IconComponent = getIconComponent(iconName);
          const isSelected = selectedIcon === iconName;

          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onSelectIcon(iconName)}
              className={cn(
                "w-9 h-9 rounded-md flex items-center justify-center transition-all",
                isSelected
                  ? "ring-2 ring-offset-1 ring-offset-background"
                  : "hover:bg-foreground/5"
              )}
              style={{
                backgroundColor: isSelected ? `${accentColor}20` : 'transparent',
                ...(isSelected && { '--tw-ring-color': accentColor } as any),
              }}
              title={iconName}
            >
              <IconComponent
                className="w-4 h-4"
                style={{ color: isSelected ? accentColor : 'currentColor' }}
              />
            </button>
          );
        })}
      </div>

      {filteredIcons.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          {t('categories.modal.noIconFound')}
        </p>
      )}
    </div>
  );
}

// Função para sugerir ícone baseado na descrição
export function suggestIcon(description: string, type: 'entrada' | 'saida'): string {
  const desc = description.toLowerCase();

  // Mapeamento de palavras-chave para ícones
  const iconMap: Record<string, string> = {
    // Receitas
    'salário': 'Wallet',
    'salario': 'Wallet',
    'freelance': 'Briefcase',
    'investimento': 'TrendingUp',
    'prêmio': 'Award',
    'premio': 'Award',
    'presente': 'Gift',
    'bônus': 'Award',
    'bonus': 'Award',

    // Despesas - Alimentação
    'alimentação': 'Utensils',
    'alimentacao': 'Utensils',
    'comida': 'Utensils',
    'restaurante': 'Utensils',
    'supermercado': 'ShoppingCart',
    'mercado': 'ShoppingCart',
    'café': 'Coffee',
    'cafe': 'Coffee',
    'pizza': 'Pizza',
    'lanche': 'Coffee',

    // Despesas - Moradia
    'aluguel': 'Home',
    'casa': 'Home',
    'moradia': 'Home',
    'condomínio': 'Home',
    'condominio': 'Home',
    'água': 'Droplet',
    'agua': 'Droplet',
    'luz': 'Zap',
    'energia': 'Zap',
    'internet': 'Wifi',

    // Despesas - Transporte
    'transporte': 'Car',
    'carro': 'Car',
    'combustível': 'Fuel',
    'combustivel': 'Fuel',
    'gasolina': 'Fuel',
    'uber': 'Car',
    'ônibus': 'Bus',
    'onibus': 'Bus',
    'metrô': 'Train',
    'metro': 'Train',
    'avião': 'Plane',
    'aviao': 'Plane',
    'viagem': 'Plane',

    // Despesas - Saúde
    'saúde': 'Heart',
    'saude': 'Heart',
    'médico': 'Stethoscope',
    'medico': 'Stethoscope',
    'farmácia': 'Heart',
    'farmacia': 'Heart',
    'academia': 'Dumbbell',

    // Despesas - Educação
    'educação': 'GraduationCap',
    'educacao': 'GraduationCap',
    'escola': 'GraduationCap',
    'curso': 'BookOpen',
    'livro': 'BookOpen',

    // Despesas - Lazer
    'lazer': 'Film',
    'cinema': 'Film',
    'streaming': 'Tv',
    'música': 'Music',
    'musica': 'Music',
    'jogo': 'Gamepad2',
    'game': 'Gamepad2',

    // Despesas - Vestuário
    'roupa': 'Shirt',
    'vestuário': 'Shirt',
    'vestuario': 'Shirt',
    'shopping': 'ShoppingBag',

    // Despesas - Tecnologia
    'celular': 'Smartphone',
    'telefone': 'Smartphone',
    'computador': 'Laptop',
    'notebook': 'Laptop',
    'tv': 'Tv',
    'eletrônico': 'Laptop',
    'eletronico': 'Laptop',
  };

  // Procurar por palavra-chave na descrição
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (desc.includes(keyword)) {
      return icon;
    }
  }

  // Ícone padrão baseado no tipo
  return type === 'entrada' ? 'DollarSign' : 'ShoppingCart';
}
