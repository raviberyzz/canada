package ca.sunlife.web.cms.core.workflow;

import ca.sunlife.web.cms.core.configurations.CDCPWorkflowConfig;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.adobe.granite.workflow.metadata.SimpleMetaDataMap;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.SearchResult;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import junitx.util.PrivateAccessor;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.day.cq.dam.api.DamConstants;

import javax.jcr.Session;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(AemContextExtension.class)
@ExtendWith(MockitoExtension.class)
public class CDCPWorkflowStepTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private WorkflowSession workflowSession;

    @Mock
    private WorkItem workItem;

    @Mock
    private ResourceResolverFactory resolverFactory;

    private final MetaDataMap metaData = new SimpleMetaDataMap();

    @InjectMocks
    private CDCPWorkflowStep cdcpWorkflowStep;

    @Mock
    private Asset asset;

    @InjectMocks
    private CDCPWorkflowStep workflowStep;

    private static final String CDCP_SERVICE = "cdcp-service";

    @BeforeEach
    public void setup(AemContext context) throws Exception {
    }

    @Test
    public void testExectute() throws Exception {
        // Mock necessary configuration
        ResourceResolver resourceResolver = mock(ResourceResolver.class);
        when(resolverFactory.getServiceResourceResolver(
                Collections.singletonMap(ResourceResolverFactory.SUBSERVICE, CDCP_SERVICE))).thenReturn(resourceResolver);

        // Mock asset related methods
        AssetManager assetManager = mock(AssetManager.class);
        lenient().when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);

        CDCPWorkflowConfig config = mock(CDCPWorkflowConfig.class);
        PrivateAccessor.setField(CDCPWorkflowStep.class, "config", config);
        lenient().when(config.cdcpPDFLocation()).thenReturn("/pdfLocation");
        lenient().when(config.cdcpJSONLocation()).thenReturn("/JSONLocation");

        Resource cdcpAppResource = mock(Resource.class);
        lenient().when(resourceResolver.getResource("/JSONLocation")).thenReturn(cdcpAppResource);
        
        QueryBuilder queryBuilder = mock(QueryBuilder.class);
        Session session = mock(Session.class);

        lenient().when(resourceResolver.adaptTo(QueryBuilder.class)).thenReturn(queryBuilder);
        lenient().when(resourceResolver.adaptTo(Session.class)).thenReturn(session);

        Query query = mock(Query.class);
        Map<String, String> qm = new HashMap<String, String>();

        lenient().when(queryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(query);

        SearchResult cdcpResult = mock(SearchResult.class);
        lenient().when(query.getResult()).thenReturn(cdcpResult);


        cdcpWorkflowStep.execute(workItem, workflowSession, metaData);
    }

    @Test
    void testCreateJsonObject() throws JSONException {
        //Mock Data
        String assetName = "test.pdf";
        String dcTitle = "Test Title";
        String province = "Ontario";
        String year = "2024";

        when(asset.getName()).thenReturn(assetName);
        when(asset.getMetadataValue(DamConstants.DC_TITLE)).thenReturn(dcTitle);
        when(asset.getMetadataValue("dam:cdcp-province")).thenReturn(province);
        when(asset.getMetadataValue("dam:cdcp-year")).thenReturn(year);

        JSONObject jsonObject = workflowStep.createJsonObject(asset,false);

        assertEquals(assetName, jsonObject.getString("name"));
        assertEquals(dcTitle, jsonObject.getString("title"));
        assertEquals(province, jsonObject.getString("province"));
        assertEquals(year, jsonObject.getString("year"));

    }
}
