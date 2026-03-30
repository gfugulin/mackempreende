export type SquadTipo = 'PEW' | 'Podcast' | 'Comunica' | 'Culture';

export type StatusPalestrante = 
  | 'a_contatar'
  | 'contatado'
  | 'aguardando_resposta'
  | 'confirmado'
  | 'recusado'
  | 'cancelado';

export type TipoEvento = 
  | 'aula'
  | 'workshop'
  | 'palestra'
  | 'podcast'
  | 'evento_externo'
  | 'reuniao_interna'
  | 'feira';

export interface Database {
  public: {
    Tables: {
      palestrantes: {
        Row: {
          id: string;
          nome: string;
          email: string | null;
          telefone: string | null;
          empresa: string | null;
          cargo: string | null;
          tema: string | null;
          bio: string | null;
          linkedin: string | null;
          instagram: string | null;
          status: StatusPalestrante;
          status_linkedin: StatusPalestrante;
          status_instagram: StatusPalestrante;
          squad_resp: SquadTipo;
          observacoes: string | null;
          criado_em: string;
          atualizado_em: string;
        };
        Insert: Omit<Database['public']['Tables']['palestrantes']['Row'], 'id' | 'criado_em' | 'atualizado_em'> & {
          id?: string;
          criado_em?: string;
          atualizado_em?: string;
        };
        Update: Partial<Database['public']['Tables']['palestrantes']['Insert']>;
      };
      eventos: {
        Row: {
          id: string;
          titulo: string;
          descricao: string | null;
          data_inicio: string;
          data_fim: string | null;
          local: string | null;
          link_online: string | null;
          tipo: TipoEvento;
          squad: SquadTipo;
          palestrante_id: string | null;
          vagas: number | null;
          confirmado: boolean;
          metadata: any;
          criado_em: string;
          atualizado_em: string;
        };
        Insert: Omit<Database['public']['Tables']['eventos']['Row'], 'id' | 'criado_em' | 'atualizado_em'> & {
          id?: string;
          criado_em?: string;
          atualizado_em?: string;
        };
        Update: Partial<Database['public']['Tables']['eventos']['Insert']>;
      };
      arquivos: {
        Row: {
          id: string;
          nome: string;
          nome_arquivo: string;
          url: string;
          tipo_mime: string | null;
          tamanho_bytes: number | null;
          squad: SquadTipo;
          evento_id: string | null;
          descricao: string | null;
          criado_em: string;
        };
        Insert: Omit<Database['public']['Tables']['arquivos']['Row'], 'id' | 'criado_em'> & {
          id?: string;
          criado_em?: string;
        };
        Update: Partial<Database['public']['Tables']['arquivos']['Insert']>;
      };
    };
  };
}
