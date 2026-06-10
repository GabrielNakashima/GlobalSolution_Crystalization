import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator } from 'react-native';
import { useApp } from '../../src/context/AppContext';

interface PredicaoMock {
  id: number;
  sample_id: string;
  classification: string;
  confidence: number;
  prediction_date: string;
}

interface ImagemAmostra {
  idImagem: string;
  url: string;
  descricao: string;
  predicao?: PredicaoMock;
}

export default function AnalyticsDashboard() {
  const { isDarkMode } = useApp();
  const [searchId, setSearchId] = useState('');
  const [imagensFiltradas, setImagensFiltradas] = useState<ImagemAmostra[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<ImagemAmostra | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  const buscarPorId = () => {
    if (!searchId) return;
    
    const mockImagens: ImagemAmostra[] = [
      { idImagem: '1', url: 'https://via.placeholder.com/150/4CC9F0/FFFFFF?text=Cristal+A', descricao: `Câmera Frontal - ID ${searchId}` },
      { idImagem: '2', url: 'https://via.placeholder.com/150/4CC9F0/FFFFFF?text=Cristal+B', descricao: `Câmera Superior - ID ${searchId}` },
    ];
    setImagensFiltradas(mockImagens);
  };

  const abrirDetalhesEPredizer = (item: ImagemAmostra) => {
    setItemSelecionado(item);
    setModalVisivel(true);
    setLoading(true);

    setTimeout(() => {
      const respostaPreDefinida: PredicaoMock = {
        id: Math.floor(Math.random() * 1000), 
        sample_id: searchId,                  
        classification: "Estável (Sucesso)",  
        confidence: 0.94,                     
        prediction_date: new Date().toLocaleDateString('pt-BR') 
      };
      
      setItemSelecionado({ ...item, predicao: respostaPreDefinida });
      setLoading(false);
    }, 1500);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? '#0B0E14' : '#F4F6F9', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#0B0E14', marginBottom: 20 },
    buscaContainer: { flexDirection: 'row', marginBottom: 20 },
    input: {
      flex: 1, backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF', color: isDarkMode ? '#FFF' : '#000',
      padding: 12, borderRadius: 8, borderWidth: 1, borderColor: isDarkMode ? '#232D3F' : '#CBD5E1'
    },
    botaoBusca: { backgroundColor: '#4CC9F0', padding: 15, marginLeft: 10, borderRadius: 8, justifyContent: 'center' },
    textoBotao: { color: '#0B0E14', fontWeight: 'bold', textAlign: 'center' },
    cardImagem: { 
      flexDirection: 'row', backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF', 
      padding: 10, marginBottom: 10, borderRadius: 8, alignItems: 'center',
      borderWidth: 1, borderColor: isDarkMode ? '#232D3F' : '#CBD5E1'
    },
    imagemThumbnail: { width: 60, height: 60, borderRadius: 5, marginRight: 15 },
    textoImagem: { fontSize: 16, color: isDarkMode ? '#FFF' : '#000' },
    
    // Modal
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalContent: { width: '85%', backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF', padding: 25, borderRadius: 12, minHeight: 200, justifyContent: 'center' },
    modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: isDarkMode ? '#FFF' : '#000' },
    modalTexto: { fontSize: 16, marginBottom: 10, color: isDarkMode ? '#8892B0' : '#4A5568' },
    modalDestaque: { color: '#4CC9F0', fontWeight: 'bold' },
    botaoFechar: { backgroundColor: '#E53E3E', padding: 15, borderRadius: 8, marginTop: 20 },
    botaoFecharTexto: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
    loadingTexto: { marginTop: 15, fontSize: 16, color: isDarkMode ? '#FFF' : '#000', textAlign: 'center' }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rastreamento de Payload</Text>

      <View style={styles.buscaContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o ID da Amostra (Ex: 102)"
          placeholderTextColor={isDarkMode ? "#566275" : "#A0AEC0"}
          value={searchId}
          onChangeText={setSearchId}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.botaoBusca} onPress={buscarPorId}>
          <Text style={styles.textoBotao}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={imagensFiltradas}
        keyExtractor={(item) => item.idImagem}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cardImagem} onPress={() => abrirDetalhesEPredizer(item)}>
            <Image source={{ uri: item.url }} style={styles.imagemThumbnail} />
            <Text style={styles.textoImagem}>{item.descricao}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: isDarkMode ? '#8892B0' : '#A0AEC0', textAlign: 'center', marginTop: 40 }}>Nenhuma imagem carregada. Busque por um ID.</Text>}
      />

      <Modal visible={modalVisivel} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {loading ? (
              <View style={{ alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4CC9F0" />
                <Text style={styles.loadingTexto}>Motor Python processando matriz...</Text>
              </View>
            ) : (
              itemSelecionado?.predicao && (
                <>
                  <Text style={styles.modalTitulo}>Resultado Preditivo IA</Text>
                  <Text style={styles.modalTexto}>ID Predição: <Text style={styles.modalDestaque}>{itemSelecionado.predicao.id}</Text></Text>
                  <Text style={styles.modalTexto}>Classificação: <Text style={styles.modalDestaque}>{itemSelecionado.predicao.classification}</Text></Text>
                  <Text style={styles.modalTexto}>Confiança Matemática: <Text style={styles.modalDestaque}>{itemSelecionado.predicao.confidence * 100}%</Text></Text>
                  <Text style={styles.modalTexto}>Data da Análise: <Text style={styles.modalDestaque}>{itemSelecionado.predicao.prediction_date}</Text></Text>
                  
                  <TouchableOpacity style={styles.botaoFechar} onPress={() => setModalVisivel(false)}>
                    <Text style={styles.botaoFecharTexto}>Fechar Validação</Text>
                  </TouchableOpacity>
                </>
              )
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}