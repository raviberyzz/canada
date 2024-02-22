package ca.sunlife.web.cms.core.workflow;

import javax.jcr.RepositoryException;


import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.day.cq.search.result.SearchResult;
import com.day.cq.search.result.Hit;
import com.day.cq.dam.api.Asset;
import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import java.util.Arrays;

import ca.sunlife.web.cms.core.configurations.CDCPWorkflowConfig;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.Mockito.anyMap;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;


public class CDCPWorkflowStepTest {

    @Mock
    private ResourceResolverFactory resolverFactory;

    @Mock
    private ResourceResolver resourceResolver;

    @Mock
    private Asset asset;

    @Mock
    private CDCPWorkflowConfig config;

    @InjectMocks
    private CDCPWorkflowStep cdcpWorkflowStep;

    @BeforeEach
    public void setUp() throws LoginException {
        MockitoAnnotations.initMocks(this);
        when(resolverFactory.getServiceResourceResolver(anyMap())).thenReturn(resourceResolver);
    }

    @Test
    public void testExecute() throws RepositoryException, WorkflowException, LoginException {
        // Mock necessary objects and method calls
        when(config.cdcpPDFLocation()).thenReturn("/content/dam/cdcp-pdfs");
        when(config.cdcpJSONLocation()).thenReturn("/content/dam/cdcp-json");

        // Mocking SearchResult and Hit for Query result
        SearchResult searchResult = mock(SearchResult.class);
        Hit hit1 = mock(Hit.class);
        Hit hit2 = mock(Hit.class);

        when(hit1.getPath()).thenReturn("/content/dam/cdcp-pdfs/pdf1");
        when(hit2.getPath()).thenReturn("/content/dam/cdcp-pdfs/pdf2");

        when(searchResult.getHits()).thenReturn(Arrays.asList(hit1, hit2));

        Resource resource1 = mock(Resource.class);
        Resource resource2 = mock(Resource.class);

        when(resource1.adaptTo(Asset.class)).thenReturn(asset);
        when(resource2.adaptTo(Asset.class)).thenReturn(asset);

        when(resourceResolver.getResource("/content/dam/cdcp-pdfs/pdf1")).thenReturn(resource1);
        when(resourceResolver.getResource("/content/dam/cdcp-pdfs/pdf2")).thenReturn(resource2);

        // Call the method to be tested
        cdcpWorkflowStep.execute(mock(WorkItem.class), mock(WorkflowSession.class), mock(MetaDataMap.class));

        assertNotNull(cdcpWorkflowStep.getResourceResolver());

    }

    @Test
    public void testExecute_FolderNotFound() throws RepositoryException, WorkflowException, LoginException {
        // Mock necessary objects and method calls
        when(config.cdcpPDFLocation()).thenReturn("/content/dam/non-existing-folder");
        when(config.cdcpJSONLocation()).thenReturn("/content/dam/cdcp-json");

        // Call the method to be tested
        cdcpWorkflowStep.execute(mock(WorkItem.class), mock(WorkflowSession.class), mock(MetaDataMap.class));

        assertNotNull(cdcpWorkflowStep.getResourceResolver());
    }
}
